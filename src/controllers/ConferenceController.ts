import type { Request, Response } from "express";
import Conference from "../models/Conference";

export class ConferenceController {
  static readonly createConference = async (req: Request, res: Response) => {
    try {
      const { name, date } = req.body;

      // Prevenir duplicados
      const nameExists = await Conference.findOne({ name });
      if (nameExists) {
        const error = new Error("Este nombre de conferencia ya ha sido registrado");
        return res.status(409).json({ error: error.message });
      }

      // Validar fecha
      const dateParsed = new Date(date);

      if (isNaN(dateParsed.getTime())) {
        return res.status(400).json({ error: "La fecha proporcionada no es válida" });
      }

      // Crea una conferencia
      const conference = new Conference(req.body);

      // Guarda la conferencia en la base de datos
      await conference.save();

      res.send("¡Conferencia registrada!");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
      console.error(error);
    }
  };

  static readonly getConferenceById = async (req: Request, res: Response) => {
    try {
      const conferenceId = req.params.id;

      // Asume que Conference.findById es un método del ORM para encontrar por ID
      const conference = await Conference.findById(conferenceId);

      if (!conference) {
        return res.status(404).json({ message: "Conferencia no encontrada" });
      }

      res.json(conference);
    } catch (error) {
      console.error("Error al obtener la conferencia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  static readonly updateConferenceById = async (req: Request, res: Response) => {
    try {
      const conferenceId = req.params.id;
      const conferenceData = req.body; // Suponiendo que los datos a actualizar están en el cuerpo de la solicitud

      // Usando un método de ORM para encontrar y actualizar la conferencia
      const updatedConference = await Conference.findByIdAndUpdate(
        conferenceId,
        conferenceData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedConference) {
        return res.status(404).json({ message: "Conferencia no encontrada" });
      }

      res.json(updatedConference);
    } catch (error) {
      console.error("Error al actualizar la conferencia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  static readonly deleteConferenceById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const conference = await Conference.findByIdAndDelete(id);

      if (!conference) {
        return res.status(404).json({ message: "Conferencia no encontrada" });
      }

      res.status(200).json({ message: "Conferencia eliminada exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar la conferencia" });
    }
  };

  static async getAllConferences(req: Request, res: Response) {
    try {
      const conferences = await Conference.find({});
      
      res.status(200).json(conferences);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener las conferencias" });
    }
  }
}
