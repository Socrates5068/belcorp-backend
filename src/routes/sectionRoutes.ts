import { Router } from "express";
import { container } from "../config/inversify.config";
import { SectionControllerInterface } from "../controllers/section/SectionControllerInterface";
import TYPES from "../config/types";
import { isGerente } from "../middleware/auth";
import { body, param } from "express-validator";

const router = Router();

//router.use(isGerente);
const sectionController = container.get<SectionControllerInterface>(
  TYPES.SectionControllerInterface
);

router.get("/", (req, res) => sectionController.getAllSections(req, res));

router.post(
  "/",
  body("name").notEmpty().withMessage("El Nombre de sección es obligatorio"),
  (req, res) => sectionController.createSection(req, res)
);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID de sección no válido"),
  (req, res) => sectionController.getSectionById(req, res)
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("ID de sección no válido"),
  body("name").notEmpty().withMessage("El nombre de la sección es obligatorio"),
  (req, res) => sectionController.updateSection(req, res)
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("ID de sección no válido"),
  (req, res) => sectionController.deleteSection(req, res)
);

export default router;
