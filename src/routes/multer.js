import express from "express";
import { upload } from "../controllers/multer.js";
const router = express.Router();

router.post('/upload', upload.single('upload-image'), (req,res) => {
    res.send("Upload successfully");
});
export default router;