import { Router } from "express";
import { body, param } from "express-validator";
import { UserController } from "../controllers/UserController";
import { handleInputErrors } from "../middleware/validation";
import { isGerente } from "../middleware/auth";

const router = Router();

/* router.use(isGerente) */

router.get("/", UserController.getAllUsers);

router.get("/:id", UserController.getUserById);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("ID no valido"),
  body("email").notEmpty().withMessage("El Email es obligatorio"),
  body('ci').notEmpty().withMessage('La cédula de identidad es obligatoria'),
  body("name").notEmpty().withMessage("El Nombre es obligatorio"),
  body("last_name").notEmpty().withMessage("El Nombre es obligatorio"),
  handleInputErrors,
  UserController.updateUser
);

router.put(
  "/status/:id",
  param("id").isMongoId().withMessage("ID no valido"),
  body("status").notEmpty().withMessage("El estado es obligatorio"),
  UserController.updateUserStatus
);

export default router;
