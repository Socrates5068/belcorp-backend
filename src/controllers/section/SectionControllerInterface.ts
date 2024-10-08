import { Request, Response } from "express";

export interface SectionControllerInterface {
  // Crear una nueva sección
  createSection(req: Request, res: Response): Promise<void>;

  // Obtener todas las secciones
  getAllSections(req: Request, res: Response): Promise<void>;

  // Obtener una sección por su ID
  getSectionById(req: Request, res: Response): Promise<void>;

  // Actualizar una sección por su ID
  updateSection(req: Request, res: Response): Promise<void>;

  // Eliminar una sección por su ID
  deleteSection(req: Request, res: Response): Promise<void>;
}
