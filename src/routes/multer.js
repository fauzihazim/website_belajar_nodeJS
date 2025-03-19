import multer from 'multer';
import express from 'express';

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './root/upload'); // Directory for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

// Create Multer instance with limits
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB maximal
    files: 1, // Allow only one file per request
  },
});

// Initialize Express
const app = express();

// Route to handle the file upload
app.post('/upload', upload.array('upload-image', 1), (req, res) => {
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

// Error handling middleware for Multer
app.use((err, req, res, next) => {
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
    default:
      res.status(500).json({
        status: "failed",
        message: "Internal Server Error"
      });
      break;
  }
});

export default app;