import { Router } from "express";
import { container } from "../config/inversify.config";
import { DocumentControllerInterface } from "../controllers/documents/DocumentControllerInterface";
import TYPES from "../config/types";
import { isGerente } from "../middleware/auth";
import { body, param, validationResult } from "express-validator";
import multer from "multer"; // Importar multer
import path from "path"; // Importar path

const router = Router();

/* router.use(isGerente); */
const documentController = container.get<DocumentControllerInterface>(
  TYPES.DocumentControllerInterface
);

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../../uploads/documents");
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${sanitizedOriginalName}`); // Usar el nombre original del archivo
  },
});

// Filtro para tipos de archivo permitidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|xls|xlsx|jpg|jpeg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF, Word o Excel."));
  }
};

const upload = multer({ storage, fileFilter }).fields([
  { name: "file", maxCount: 1 },
]); // Cambia a .fields para manejar múltiples campos

router.get("/", (req, res) => documentController.getAllDocuments(req, res));

router.post(
  "/",
  upload, // Middleware de multer para manejar la subida de archivos
  body("title")
    .notEmpty()
    .withMessage("El título del documento es obligatorio"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  (req, res) => {
    // Manejo de errores de subida de archivos
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Asegúrate de que req.files es del tipo correcto

    if (files && files.file?.length > 0) {
      console.log("File uploaded successfully:", files.file[0]); // Accede al primer archivo subido
    } else {
      console.error("No file uploaded or file field is incorrect.");
      return res
        .status(400)
        .json({ message: "No file uploaded or file field is incorrect." });
    }

    documentController.createDocument(req, res);
  }
);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID de documento no válido"),
  (req, res) => documentController.getDocumentById(req, res)
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("ID de documento no válido"),
  body("title")
    .notEmpty()
    .withMessage("El título del documento es obligatorio"),
  (req, res) => documentController.updateDocument(req, res)
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("ID de documento no válido"),
  (req, res) => documentController.deleteDocument(req, res)
);

router.get(
  "/download/:id",
  param("id").isMongoId().withMessage("ID de documento no válido"),
  (req, res) => documentController.downloadDocumentById(req, res) // Ruta para descargar el documento
);

export default router;
