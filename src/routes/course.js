import express from 'express';
import { getCourses, getCourse, addCourse, editCourse, deleteCourse } from '../controllers/course.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';
import { validateDeleteCourse, validateEditCourse, validateGetCourse, validateGetCourses, validatePostCourse } from '../middleware/courseMiddleware.js';
import { multerValidator } from '../middleware/multerMiddleware.js';
import { upload } from '../controllers/multer.js';
const router = express.Router();

router.get('/courses', validateGetCourses, getCourses);
router.get('/course/:id', authenticateToken, validateGetCourse, getCourse);
// router.post('/course', [authenticateToken, isAdmin], addCourse);
router.post('/course', authenticateToken, isAdmin, validatePostCourse, addCourse);
// router.post('/course', addCourse);
router.put('/course/:id', authenticateToken, isAdmin, validateEditCourse, editCourse);
router.delete('/course/:id', authenticateToken, isAdmin, validateDeleteCourse, deleteCourse);

// Initialize Express
const app = express();
app.post('/uploadInCourse', upload.array('upload-image', 1), (req, res) => {
    try {
      if (!req.files.length) {
        return res.status(400).json({
          status: "failed",
          message: 'At least one file must be uploaded!'
        });
      }
      res.status(201).json({
        status: "success",
        message: 'File uploaded successfully!'
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: "Internal Server Error"
      });
    }
});

app.use((err, req, res, next) => {
    console.log('Error Code:', err.code);
    console.log('Error Message:', err.message);
    console.log('Full Error Object:', err);
    switch (err.code) {
        case 'LIMIT_FILE_COUNT':
            res.status(400).json({
            status: "failed",
            message: 'Only one file is allowed!'
            });
            break;
        case 'LIMIT_FILE_SIZE':
            res.status(400).json({
            status: "failed",
            message: 'File is too large!'
            });
            break;
        case 'FILE_TYPE_NOT_MATCH':
            res.status(400).json({
                status: "failed",
                message: err.message
            });
            break;
        default:
            res.status(500).json({
            status: "failed",
            message: "Internal Server Errors"
            });
            break;
    }
});

// export default app;
export default [router, app];