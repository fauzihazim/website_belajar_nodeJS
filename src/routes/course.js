import express from 'express';
import { getCourses, getCourse, addCourse, editCourse, deleteCourse } from '../controllers/course.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';
import { validateDeleteCourse, validateEditCourse, validateGetCourse, validateGetCourses, validatePostCourse } from '../middleware/courseMiddleware.js';
const router = express.Router();

router.get('/courses', validateGetCourses, getCourses);
router.get('/course/:id', authenticateToken, validateGetCourse, getCourse);
// router.post('/course', [authenticateToken, isAdmin], addCourse);
router.post('/course', authenticateToken, isAdmin, validatePostCourse, addCourse);
// router.post('/course', addCourse);
router.put('/course/:id', authenticateToken, isAdmin, validateEditCourse, editCourse);
router.delete('/course/:id', authenticateToken, isAdmin, validateDeleteCourse, deleteCourse);

export default router;