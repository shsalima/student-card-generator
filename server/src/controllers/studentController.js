import {
  addStudents,
  deleteStudentById,
  generateStudentCard,
  getDashboardSummary,
  getStudentById,
  getStudents,
  updateStudentById,
  updateStudentDecision,
} from '../data/students.js';

export const listStudents = async (request, response) => {
  try {
    const { status, query, limit } = request.query;
    const students = await getStudents({ status, query, limit });

    return response.json({
      success: true,
      data: students,
      total: students.length,
    });
  } catch (error) {
    return response.status(503).json({ success: false, message: 'Impossible de récupérer les étudiants.', error: error.message });
  }
};

export const getDashboard = async (_request, response) => {
  try {
    return response.json({ success: true, ...(await getDashboardSummary()) });
  } catch (error) {
    return response.status(503).json({ success: false, message: 'Impossible de récupérer le tableau de bord.', error: error.message });
  }
};

export const getStudent = async (request, response) => {
  try {
    const student = await getStudentById(request.params.id);

    if (!student) {
      return response.status(404).json({ success: false, message: 'Étudiant introuvable.' });
    }

    return response.json({ success: true, data: student });
  } catch (error) {
    return response.status(503).json({ success: false, message: 'Impossible de récupérer cet étudiant.', error: error.message });
  }
};

export const createStudent = async (request, response) => {
  try {
    const payload = request.body ?? {};
    const [student] = await addStudents([payload]);

    if (!student) {
      return response.status(400).json({ success: false, message: 'Les informations de l’étudiant sont incomplètes.' });
    }

    return response.status(201).json({ success: true, data: student });
  } catch (error) {
    return response.status(503).json({ success: false, message: 'Impossible d’ajouter l’étudiant.', error: error.message });
  }
};

export const updateStudent = async (request, response) => {
  try {
    const student = await updateStudentById(request.params.id, request.body ?? {});

    if (!student) {
      return response.status(404).json({ success: false, message: 'Étudiant introuvable.' });
    }

    return response.json({ success: true, data: student });
  } catch (error) {
    return response.status(503).json({ success: false, message: 'Impossible de modifier l’étudiant.', error: error.message });
  }
};

export const deleteStudent = async (request, response) => {
  try {
    const deleted = await deleteStudentById(request.params.id);

    if (!deleted) {
      return response.status(404).json({ success: false, message: 'Étudiant introuvable.' });
    }

    return response.json({ success: true, message: 'Étudiant supprimé.' });
  } catch (error) {
    return response.status(503).json({ success: false, message: 'Impossible de supprimer l’étudiant.', error: error.message });
  }
};

export const updateDecision = async (request, response) => {
  try {
    const { decision, reason } = request.body ?? {};
    const student = await updateStudentDecision(request.params.id, decision, reason ?? '');

    if (!student) {
      return response.status(404).json({ success: false, message: 'Étudiant introuvable.' });
    }

    return response.json({ success: true, data: student });
  } catch (error) {
    return response.status(503).json({ success: false, message: 'Impossible de mettre à jour la décision.', error: error.message });
  }
};

export const getStudentCard = async (request, response) => {
  try {
    const card = await generateStudentCard(request.params.id);

    if (!card) {
      return response.status(404).json({ success: false, message: 'Carte étudiante introuvable.' });
    }

    return response.json({ success: true, data: card });
  } catch (error) {
    return response.status(503).json({ success: false, message: 'Impossible de générer la carte étudiante.', error: error.message });
  }
};
