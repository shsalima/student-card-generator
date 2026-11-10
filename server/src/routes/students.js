import { Router } from 'express';
import {
  createStudent,
  deleteStudent,
  getDashboard,
  getStudent,
  getStudentCard,
  listStudents,
  updateDecision,
  updateStudent,
} from '../controllers/studentController.js';

const router = Router();

router.get('/students', listStudents);
router.get('/students/:id', getStudent);
router.get('/students/:id/card', getStudentCard);
router.get('/dashboard', getDashboard);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.patch('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);
router.patch('/students/:id/decision', updateDecision);

export default router;
