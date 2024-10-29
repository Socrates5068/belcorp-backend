import { Router } from "express";
import { ConferenceController } from "../controllers/ConferenceController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

// Ruta para crear una nueva conferencia
router.post(
  "/",
  body("name").notEmpty().withMessage("El nombre no puede ir vacío"),
  body("date").notEmpty().isISO8601().withMessage("La fecha debe ser válida"),
  handleInputErrors,
  ConferenceController.createConference
);

// Ruta para obtener una conferencia por ID
router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID de conferencia no válido"),
  handleInputErrors,
  ConferenceController.getConferenceById
);

// Ruta para actualizar una conferencia por ID
router.put(
  "/:id",
  param("id").isMongoId().withMessage("ID de conferencia no válido"),
  body("name").notEmpty().withMessage("El nombre no puede ir vacío"),
  body("date").notEmpty().isISO8601().withMessage("La fecha debe ser válida"),
  handleInputErrors,
  ConferenceController.updateConferenceById
);

// Ruta para eliminar una conferencia por ID
router.delete(
  "/:id",
  param("id").isMongoId().withMessage("ID de conferencia no válido"),
  handleInputErrors,
  ConferenceController.deleteConferenceById
);

// Ruta para obtener todas las conferencias
router.get("/", ConferenceController.getAllConferences);

export default router;
