import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import multer from "multer";
import path from "path";
import * as fs from 'fs';
import { ReportController } from "../controllers/ReportController";

// Multer configuration for PDF, Word, or Excel files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/reports');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create directory if it doesn't exist
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${sanitizedOriginalName}`); // Use the original file name
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|xls|xlsx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF, Word o Excel."));
  }
};

const upload = multer({ storage, fileFilter }).single("file");

const router = Router();

// Route to create a new report
router.post(
  "/",
  upload,
  body("name").notEmpty().withMessage("El nombre no puede estar vacío"),
  body("reportType").notEmpty().withMessage("El tipo de reporte no puede estar vacío"),
  body("userId").notEmpty().withMessage("El ID de usuario no puede estar vacío"),
  handleInputErrors,
  ReportController.createReport
);

// Route to get a report by ID
router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID de reporte inválido"),
  handleInputErrors,
  ReportController.getReportById
);

// Route to update a report by ID
router.put(
  "/:id",
  upload,
  param("id").isMongoId().withMessage("ID de reporte inválido"),
  body("name").notEmpty().withMessage("El nombre no puede estar vacío"),
  body("reportType").notEmpty().withMessage("El tipo de reporte no puede estar vacío"),
  handleInputErrors,
  ReportController.updateReportById
);

// Route to delete a report by ID
router.delete(
  "/:id",
  param("id").isMongoId().withMessage("ID de reporte inválido"),
  handleInputErrors,
  ReportController.deleteReportById
);

// Route to get all reports
router.get("/", ReportController.getAllReports);

router.get("/user/:userId", ReportController.getReportsByUserId);

export default router;
