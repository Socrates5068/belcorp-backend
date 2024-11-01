import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { FragranceController } from "../controllers/FragranceController";
import multer from "multer";
import path from "path"; // Importar path
import * as fs from 'fs';

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/images');
    // Verificar si el directorio existe
    if (!fs.existsSync(dir)) {
      // Crear el directorio, incluyendo cualquier subdirectorio necesario
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${sanitizedOriginalName}`); // Usar el nombre original del archivo
  },
});

// Filtro para tipos de archivo permitidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png/;
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

const upload = multer({ storage, fileFilter }).single("file");

const router = Router();

// Route to create a new fragrance
router.post(
  "/",
  upload,
  body("name").notEmpty().withMessage("The name cannot be empty"),
  body("description").notEmpty().withMessage("The description cannot be empty"),
  handleInputErrors,
  FragranceController.createFragrance
);

// Route to get a fragrance by ID
router.get(
  "/:id",
  param("id").isMongoId().withMessage("Invalid fragrance ID"),
  handleInputErrors,
  FragranceController.getFragranceById
);

// Route to update a fragrance by ID
router.put(
  "/:id",
  upload, // Manejar la carga de un único archivo con el campo "file"
  param("id").isMongoId().withMessage("Invalid fragrance ID"),
  body("name").notEmpty().withMessage("The name cannot be empty"),
  body("description").notEmpty().withMessage("The description cannot be empty"),
  handleInputErrors,
  FragranceController.updateFragranceById
);

// Route to delete a fragrance by ID
router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Invalid fragrance ID"),
  handleInputErrors,
  FragranceController.deleteFragranceById
);

// Route to get all fragrances
router.get("/", FragranceController.getAllFragrances);

export default router;
