const express = require("express");
const multer = require("multer");
const Document = require("../models/documentModel.js")
const { authenticateToken } = require("../utils/authMiddleware.js");
const fs = require("fs");
const path = require("path");

const documentRouter = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOC, and DOCX are allowed."));
    }
  },
});

documentRouter.post("/jobs/:id/documents/:portalId", authenticateToken,
  (req, res, next) => {
    upload.single("documents")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    const { id, portalId } = req.params;

    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const jobDocument = await Document.create({
        jobId: id,
        portalId,
        fileName: req.file.filename, 
        filePath: req.file.path,   
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      });

      res.status(201).json({
        message: "File uploaded successfully",
        document: jobDocument,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);


module.exports = documentRouter;
