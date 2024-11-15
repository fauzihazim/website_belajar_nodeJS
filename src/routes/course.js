import express from 'express';
import { getCourses, getCourse, addCourse, editCourse, deleteCourse } from '../controllers/course.js';
const router = express.Router();

router.get('/course', getCourses);
router.get('/course/:id', getCourse);
router.post('/course', addCourse);
router.put('/course/:id', editCourse);
router.delete('/course/:id', deleteCourse);

export default router;