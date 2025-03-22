import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Handle __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// HTTP GET to serve an image
router.get("/:filename", (req, res) => {
  const { filename } = req.params;
  
  // Construct the file path
  const filePath = path.join(__dirname, "../uploads", filename);

  // Check if the file exists and send it
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("File not found or inaccessible:", err);
      return res.status(404).send("Image not found!");
    }
  });
});

export default router;