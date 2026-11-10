import test from 'node:test';
import assert from 'node:assert/strict';

import { isDatabaseAvailable } from '../config/database.js';
import { addStudents, getDashboardSummary, getStudents, updateStudentDecision } from './students.js';

test('dashboard summary exposes student totals', async () => {
  if (!(await isDatabaseAvailable())) {
    return;
  }

  const summary = await getDashboardSummary();

  assert.ok(summary.total >= 0);
  assert.ok(summary.accepted >= 0);
  assert.ok(summary.pending >= 0);
  assert.ok(summary.rejected >= 0);
  assert.ok(typeof summary.completion === 'number');
});

test('student filtering and update decision are supported', async () => {
  if (!(await isDatabaseAvailable())) {
    return;
  }

  const created = await addStudents([{ cin: 'CIN999999', apogeeCode: 'APO9999999', firstName: 'Test', lastName: 'User', field: 'Mathématiques', status: 'pending' }]);

  assert.equal(created.length, 1);

  const pendingStudents = await getStudents({ status: 'pending' });
  assert.ok(pendingStudents.some((student) => student.cin === 'CIN999999'));

  const updated = await updateStudentDecision(created[0].id, 'accepted', 'Bonne photo');
  assert.equal(updated.status, 'accepted');
  assert.equal(updated.statusLabel, 'Acceptée');
});
