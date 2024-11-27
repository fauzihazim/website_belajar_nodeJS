import express from 'express';
import { getCourses, getCourse, addCourse, editCourse, deleteCourse } from '../controllers/course.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/course', getCourses);
router.get('/course/:id', authenticateToken, getCourse);
router.post('/course', [authenticateToken, isAdmin], addCourse);
router.put('/course/:id', editCourse);
router.delete('/course/:id', deleteCourse);

export default router;