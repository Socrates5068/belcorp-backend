import { Request, Response } from "express";

export interface DocumentControllerInterface {
  getAllDocuments(req: Request, res: Response): Promise<void>;
  getDocumentById(req: Request, res: Response): Promise<void>;
  createDocument(req: Request, res: Response): Promise<void>;
  updateDocument(req: Request, res: Response): Promise<void>;
  deleteDocument(req: Request, res: Response): Promise<void>;
  downloadDocumentById(req: Request, res: Response): Promise<void>;
}
