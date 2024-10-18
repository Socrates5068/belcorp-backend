import type { Request, Response } from "express";
import Campaign from "../models/campaign";

export class CampaignController {
  static readonly createCampaign = async (req: Request, res: Response) => {
    try {
      const { name, startDate, endDate } = req.body;

      // Prevenir duplicados
      const nameExists = await Campaign.findOne({ name });
      if (nameExists) {
        const error = new Error("Este nombre de campaña ya ha sido registrado");
        return res.status(409).json({ error: error.message });
      }

      // Validar fechas
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res
          .status(400)
          .json({ error: "Las fechas proporcionadas no son válidas" });
      }

      if (start >= end) {
        return res.status(400).json({
          error: "La fecha de inicio debe ser anterior a la fecha de fin",
        });
      }

      // Crea una campaña
      const campaign = new Campaign(req.body);

      // Guarde la campaña en la base de datos
      await campaign.save();

      res.send("¡Campaña registrada!");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
      console.log(error);
    }
  };

  static readonly getCampaignById = async (req: Request, res: Response) => {
    try {
      const campaignId = req.params.id;

      // Asume que Campaign.findById es un método del ORM para encontrar por ID
      const campaign = await Campaign.findById(campaignId);

      if (!campaign) {
        return res.status(404).json({ message: "Campaña no encontrada" });
      }

      res.json(campaign);
    } catch (error) {
      console.error("Error al obtener la campaña:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  static readonly updateCampaignById = async (req: Request, res: Response) => {
    try {
      const campaignId = req.params.id;
      const campaignData = req.body; // Suponiendo que los datos a actualizar están en el cuerpo de la solicitud

      // Usando un método de ORM para encontrar y actualizar la campaña
      const updatedCampaign = await Campaign.findByIdAndUpdate(
        campaignId,
        campaignData,
        {
          new: true,
          runValidators: true, // Opcional: Esto asegura que las validaciones del modelo se ejecuten
        }
      );

      if (!updatedCampaign) {
        return res.status(404).json({ message: "Campaña no encontrada" });
      }

      res.json(updatedCampaign);
    } catch (error) {
      console.error("Error al actualizar la campaña:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  static readonly deleteCampaignById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const campaign = await Campaign.findByIdAndDelete(id);

      if (!campaign) {
        return res.status(404).json({ message: "Campaña no encontrada" });
      }

      res.status(200).json({ message: "Campaña eliminada exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar la campaña" });
    }
  }

  static async getAllCampaigns(req, res) {
    try {
      const campaigns = await Campaign.find({});
      
      res.status(200).json(campaigns);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener las campañas' });
    }
  }
}
