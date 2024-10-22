import { Router } from "express";
import { CampaignController } from "../controllers/CampaignController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

//router.use(isGerente);

router.post(
  "/",
  body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
  body("startDate").notEmpty().withMessage("El apellido no puede ir vacio"),
  body("endDate").notEmpty().withMessage("El apellido no puede ir vacio"),
  handleInputErrors,
  CampaignController.createCampaign
);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID de campaña no válido"),
  CampaignController.getCampaignById
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("ID de campaña no válido"),
  body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
  body("startDate").notEmpty().withMessage("El apellido no puede ir vacio"),
  body("endDate").notEmpty().withMessage("El apellido no puede ir vacio"),
  handleInputErrors,
  CampaignController.updateCampaignById
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("ID de sección no válido"),
  handleInputErrors,
  CampaignController.deleteCampaignById
);

router.get('/', CampaignController.getAllCampaigns);

export default router;
