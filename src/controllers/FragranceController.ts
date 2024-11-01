import type { Request, Response } from "express";
import Fragrance from "../models/Fragrance";
import * as path from 'path';

export class FragranceController {
  static readonly createFragrance = async (req: Request, res: Response) => {
    try {
      const name = req.body.name;
      const description = req.body.description;
      const imageUrl = path.basename(req.file.path);

      if (!imageUrl) {
        return res.status(400).json({ error: "Image upload failed" });
      }

      // Prevent duplicates
      const nameExists = await Fragrance.findOne({ name });
      if (nameExists) {
        const error = new Error(
          "Este nombre de fragancia ya ha sido registrado"
        );
        return res.status(409).json({ error: error.message });
      }

      // Create a fragrance
      const fragrance = new Fragrance({ name, description, imageUrl });

      // Save the fragrance to the database
      await fragrance.save();

      res.send("¡Fragancia registrada!");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
      console.error(error);
    }
  };

  static readonly getFragranceById = async (req: Request, res: Response) => {
    try {
      const fragranceId = req.params.id;

      // Assuming Fragrance.findById is an ORM method to find by ID
      const fragrance = await Fragrance.findById(fragranceId);

      if (!fragrance) {
        return res.status(404).json({ message: "Fragancia no encontrada" });
      }

      res.json(fragrance);
    } catch (error) {
      console.error("Error al obtener la fragancia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  static readonly updateFragranceById = async (req: Request, res: Response) => {
    try {
      const fragranceId = req.params.id;

      // Verificar si se ha subido un nuevo archivo
      const newImageUrl = path.basename(req.file.path);

      // Obtener los datos del cuerpo de la solicitud
      const fragranceData = req.body;

      // Si se ha subido una nueva imagen, actualizar la URL en los datos de la fragancia
      if (newImageUrl) {
        fragranceData.imageUrl = newImageUrl;
      }

      // Usar un método del ORM para encontrar y actualizar la fragancia
      const updatedFragrance = await Fragrance.findByIdAndUpdate(
        fragranceId,
        fragranceData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedFragrance) {
        return res.status(404).json({ message: "Fragancia no encontrada" });
      }

      res.json(updatedFragrance);
    } catch (error) {
      console.error("Error al actualizar la fragancia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  static readonly deleteFragranceById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const fragrance = await Fragrance.findByIdAndDelete(id);

      if (!fragrance) {
        return res.status(404).json({ message: "Fragancia no encontrada" });
      }

      res.status(200).json({ message: "Fragancia eliminada exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar la fragancia" });
    }
  };

  static async getAllFragrances(req: Request, res: Response) {
    try {
      const fragrances = await Fragrance.find({});

      res.status(200).json(fragrances);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener las fragancias" });
    }
  }
}
