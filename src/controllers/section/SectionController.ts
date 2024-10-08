import { inject, injectable } from "inversify";
import TYPES from "../../config/types";
import { Request, Response } from "express";
import { SectionControllerInterface } from "./SectionControllerInterface";
import { Logger } from "pino";
import Section from "../../models/Section";
import User from "../../models/User";

@injectable()
export default class SectionController implements SectionControllerInterface {
  private readonly logger: Logger;

  constructor(
    @inject(TYPES.Logger)
    logger: Logger
  ) {
    this.logger = logger;
  }
  public async createSection(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      // Verificar si el nombre de la sección ya existe
      const existingSection = await Section.findOne({ name });
      if (existingSection) {
        res.status(400).json({ error: "La sección ya existe" });
        return;
      }

      // Crear una nueva instancia del modelo Section
      const section = new Section({ name });

      // Guardar la nueva sección en la base de datos
      await section.save();

      // Respuesta de éxito
      res.status(201).json({ message: "Sección creada con éxito", section });
    } catch (error) {
      this.logger.error("Error al crear la sección", { error });
      res.status(500).json({ error: "Error al crear la sección" });
    }
  }

  public async getAllSections(req: Request, res: Response): Promise<void> {
    try {
      // Obtener todas las secciones de la base de datos
      const sections = await Section.find();

      // Verificar si hay secciones
      if (sections.length === 0) {
        this.logger.warn("No se encontraron secciones en la base de datos");
        res.status(404).json({ message: "No se encontraron secciones" });
        return;
      }

      res.status(200).json(sections);
    } catch (error) {
      this.logger.error("Error al obtener las secciones", { error });
      res.status(500).json({ error: "Error al obtener las secciones" });
    }
  }

  public async getSectionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Buscar la sección por ID
      const section = await Section.findById(id);

      // Si no se encuentra la sección, devolver un error 404
      if (!section) {
        this.logger.warn(`Sección no encontrada con ID: ${id}`);
        res.status(404).json({ message: "Sección no encontrada" });
        return;
      }

      res.status(200).json(section);
    } catch (error) {
      this.logger.error(
        `Error al obtener la sección con ID: ${req.params.id}`,
        { error }
      );
      res.status(500).json({ error: "Error al obtener la sección" });
    }
  }

  public async updateSection(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const { name } = req.body;

      // Verificar si la sección existe
      const section = await Section.findById(id);
      if (!section) {
        this.logger.warn(`Sección no encontrada con ID: ${id}`);
        res.status(404).json({ message: "Sección no encontrada" });
        return;
      }

      // Actualizar la sección
      section.name = name;
      await section.save();

      res
        .status(200)
        .json({ message: "Sección actualizada con éxito", section });
    } catch (error) {
      this.logger.error(`Error al actualizar la sección con ID: ${id}`, {
        error,
      });
      res.status(500).json({ error: "Error al actualizar la sección" });
    }
  }

  public async deleteSection(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      // Verificar si la sección existe
      const section = await Section.findById(id);
      if (!section) {
        this.logger.warn(`Sección no encontrada con ID: ${id}`);
        res.status(404).json({ message: "Sección no encontrada" });
        return;
      }

      // Verificar si hay usuarios registrados en la sección
      const usersInSection = await User.find({ section: id });

      if (usersInSection.length > 0) {
        this.logger.warn(
          `No se puede eliminar la sección con ID: ${id}, hay usuarios registrados en esta sección.`
        );
        res.status(400).json({
          message:
            "No se puede eliminar la sección, hay usuarios registrados en ella.",
        });
        return;
      }

      // Eliminar la sección
      await Section.findByIdAndDelete(id);

      // Log de éxito y respuesta
      this.logger.info(`Sección con ID: ${id} eliminada con éxito.`);
      res.status(200).json({ message: "Sección eliminada con éxito" });
    } catch (error) {
      this.logger.error(`Error al eliminar la sección con ID: ${id}`, {
        error,
      });
      res.status(500).json({ error: "Error al eliminar la sección" });
    }
  }
}
