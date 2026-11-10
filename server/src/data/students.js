import { databasePool } from '../config/database.js';

const statusLabels = {
  accepted: 'Acceptée',
  pending: 'En attente',
  rejected: 'Refusée',
};

const normalizeStatus = (status) => {
  if (!status) {
    return 'pending';
  }

  const normalized = status.toString().trim().toLowerCase();

  if (normalized === 'acceptée' || normalized === 'accepted' || normalized === 'validee' || normalized === 'validated') {
    return 'accepted';
  }

  if (normalized === 'refusée' || normalized === 'rejected' || normalized === 'refusee' || normalized === 'refusé') {
    return 'rejected';
  }

  return 'pending';
};

const mapStudent = (record) => ({
  id: Number(record.id),
  cin: record.cin,
  apogeeCode: record.apogee_code,
  firstName: record.first_name,
  lastName: record.last_name,
  field: record.field,
  email: record.email,
  status: record.status,
  photoStatus: record.photo_status,
  rejectionReason: record.rejection_reason || '',
  statusLabel: statusLabels[record.status] ?? record.status,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});

const toDbStatus = (status) => normalizeStatus(status);

export const getStudents = async ({ status, query, limit } = {}) => {
  const filters = [];
  const values = [];

  let sql = 'SELECT * FROM students';

  if (status && status !== 'all' && status !== 'Tous') {
    const normalized = toDbStatus(status);
    sql += ' WHERE status = ?';
    values.push(normalized);
  }

  if (query) {
    const searchTerm = query.toString().trim();
    if (searchTerm) {
      const clause = values.length ? ' AND ' : ' WHERE ';
      sql += `${clause} (LOWER(cin) LIKE ? OR LOWER(apogee_code) LIKE ? OR LOWER(first_name) LIKE ? OR LOWER(last_name) LIKE ? OR LOWER(field) LIKE ? OR LOWER(email) LIKE ?) `;
      const term = `%${searchTerm.toLowerCase()}%`;
      values.push(term, term, term, term, term, term);
    }
  }

  sql += ' ORDER BY created_at DESC';

  if (limit) {
    const numericLimit = Number(limit);
    if (Number.isFinite(numericLimit) && numericLimit > 0) {
      sql += ' LIMIT ?';
      values.push(numericLimit);
    }
  }

  const [rows] = await databasePool.execute(sql, values);
  return rows.map(mapStudent);
};

export const getStudentById = async (id) => {
  const [rows] = await databasePool.execute('SELECT * FROM students WHERE id = ?', [Number(id)]);
  return rows[0] ? mapStudent(rows[0]) : null;
};

export const addStudents = async (records = []) => {
  const entries = Array.isArray(records) ? records : [records];
  const created = [];

  for (const record of entries) {
    if (!record || !record.cin || !record.apogeeCode || !record.firstName || !record.lastName) {
      continue;
    }

    const status = toDbStatus(record.status || 'pending');
    const student = {
      cin: record.cin,
      apogeeCode: record.apogeeCode,
      firstName: record.firstName,
      lastName: record.lastName,
      field: record.field || 'Inconnue',
      email: record.email || `${record.firstName}.${record.lastName}@fpbm.ma`.toLowerCase(),
      status,
      photoStatus: record.photoStatus === 'validated' ? 'validated' : record.photoStatus === 'rejected' ? 'rejected' : 'waiting',
      rejectionReason: record.rejectionReason || '',
    };

    const [result] = await databasePool.execute(
      'INSERT INTO students (cin, apogee_code, first_name, last_name, field, email, status, photo_status, rejection_reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        student.cin,
        student.apogeeCode,
        student.firstName,
        student.lastName,
        student.field,
        student.email,
        student.status,
        student.photoStatus,
        student.rejectionReason,
      ],
    );

    const newStudent = await getStudentById(result.insertId);
    created.push(newStudent);
  }

  return created;
};

export const updateStudentById = async (id, updates = {}) => {
  const currentStudent = await getStudentById(id);

  if (!currentStudent) {
    return null;
  }

  const patch = {
    cin: updates.cin ?? currentStudent.cin,
    apogeeCode: updates.apogeeCode ?? currentStudent.apogeeCode,
    firstName: updates.firstName ?? currentStudent.firstName,
    lastName: updates.lastName ?? currentStudent.lastName,
    field: updates.field ?? currentStudent.field,
    email: updates.email ?? currentStudent.email,
    status: updates.status ? toDbStatus(updates.status) : currentStudent.status,
    photoStatus: updates.photoStatus === 'validated' ? 'validated' : updates.photoStatus === 'rejected' ? 'rejected' : currentStudent.photoStatus,
    rejectionReason: updates.rejectionReason ?? currentStudent.rejectionReason,
  };

  await databasePool.execute(
    'UPDATE students SET cin = ?, apogee_code = ?, first_name = ?, last_name = ?, field = ?, email = ?, status = ?, photo_status = ?, rejection_reason = ? WHERE id = ?',
    [
      patch.cin,
      patch.apogeeCode,
      patch.firstName,
      patch.lastName,
      patch.field,
      patch.email,
      patch.status,
      patch.photoStatus,
      patch.rejectionReason,
      Number(id),
    ],
  );

  return getStudentById(id);
};

export const deleteStudentById = async (id) => {
  const currentStudent = await getStudentById(id);
  if (!currentStudent) {
    return false;
  }

  await databasePool.execute('DELETE FROM students WHERE id = ?', [Number(id)]);
  return true;
};

export const updateStudentDecision = async (id, decision, reason = '') => {
  const currentStudent = await getStudentById(id);

  if (!currentStudent) {
    return null;
  }

  const normalizedDecision = toDbStatus(decision);
  const nextPhotoStatus = normalizedDecision === 'accepted' ? 'validated' : normalizedDecision === 'rejected' ? 'rejected' : 'waiting';

  await databasePool.execute('UPDATE students SET status = ?, photo_status = ?, rejection_reason = ? WHERE id = ?', [normalizedDecision, nextPhotoStatus, reason || '', Number(id)]);

  return getStudentById(id);
};

export const getDashboardSummary = async () => {
  const [rows] = await databasePool.execute(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) AS accepted,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected
    FROM students
  `);

  const summary = rows[0] || {};
  const total = Number(summary.total || 0);
  const accepted = Number(summary.accepted || 0);
  const pending = Number(summary.pending || 0);
  const rejected = Number(summary.rejected || 0);

  return {
    total,
    accepted,
    pending,
    rejected,
    completion: total === 0 ? 0 : Math.round((accepted / total) * 100),
    recent: await getStudents({ limit: 4 }),
  };
};

export const generateStudentCard = async (id) => {
  const student = await getStudentById(id);

  if (!student) {
    return null;
  }

  return {
    id: student.id,
    fullName: `${student.firstName} ${student.lastName}`,
    firstName: student.firstName,
    lastName: student.lastName,
    apogeeCode: student.apogeeCode,
    field: student.field,
    cin: student.cin,
    status: student.status,
    statusLabel: student.statusLabel,
    cardLabel: 'CARTE 2024–2025',
  };
};
