import type { Request, Response } from "express";
import * as path from "path";
import Report from "../models/Reports";

export class ReportController {
  static readonly createReport = async (req: Request, res: Response) => {
    try {
      const name = req.body.name;
      const reportType = req.body.reportType;
      const userId = req.body.userId;
      const fileUrl = path.basename(req.file.path);

      console.log(req.file);
      if (!fileUrl) {
        return res.status(400).json({ error: "La carga del archivo falló" });
      }

      // Prevent duplicates
      const nameExists = await Report.findOne({ name });
      if (nameExists) {
        const error = new Error("Este nombre de reporte ya ha sido registrado");
        return res.status(409).json({ error: error.message });
      }

      // Get the current date and time for creationDate
      const creationDate = new Date();

      // Create a report
      const report = new Report({
        name,
        reportType,
        userId,
        fileUrl,
        creationDate,
      });

      // Save the report to the database
      await report.save();

      res.send("¡Reporte registrado!");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
      console.error(error);
    }
  };

  static readonly getReportById = async (req: Request, res: Response) => {
    try {
      const reportId = req.params.id;

      const report = await Report.findById(reportId);

      if (!report) {
        return res.status(404).json({ message: "Reporte no encontrado" });
      }

      res.json(report);
    } catch (error) {
      console.error("Error al obtener el reporte:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  static readonly updateReportById = async (req: Request, res: Response) => {
    try {
      console.log(
        "🚀 ~ ReportController ~ readonlyupdateReportById= ~ req.file.path:",
        req.file.path
      );
      const reportId = req.params.id;

      const newFileUrl = path.basename(req.file.path);

      const reportData = req.body;

      if (newFileUrl) {
        reportData.fileUrl = newFileUrl;
      }

      const updatedReport = await Report.findByIdAndUpdate(
        reportId,
        reportData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedReport) {
        return res.status(404).json({ message: "Reporte no encontrado" });
      }

      res.json(updatedReport);
    } catch (error) {
      console.error("Error al actualizar el reporte:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  static readonly deleteReportById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const report = await Report.findByIdAndDelete(id);

      if (!report) {
        return res.status(404).json({ message: "Reporte no encontrado" });
      }

      res.status(200).json({ message: "Reporte eliminado exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el reporte" });
    }
  };

  static async getAllReports(req: Request, res: Response) {
    try {
      const reports = await Report.find({});

      res.status(200).json(reports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener los reportes" });
    }
  }

  static readonly getReportsByUserId = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      // Find all reports for the given userId
      const reports = await Report.find({ userId });

      // Check if any reports were found
      if (reports.length === 0) {
        return res.status(200).json([])
      }

      // Send the found reports as a response
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error al obtener los reportes." });
      console.error(error);
    }
  };
}
