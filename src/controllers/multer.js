import multer from 'multer';

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
export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Allowed MIME types
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        
        // Check if the file's MIME type is allowed
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            const error = new Error('File type not allowed. Only JPG, PNG, JPEG, and WEBP are allowed.');
            error.code = "FILE_TYPE_NOT_MATCH"; // Add a custom code
            cb(error); // Reject the file
        }
    },
    limits: {
        fileSize: 3 * 1024 * 1024, // 3MB maximal
        files: 1, // Allow only one file per request
    },
});