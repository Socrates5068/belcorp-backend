import { injectable, inject } from "inversify";
import TYPES from "../../config/types";
import { Request, Response } from "express";
import { DocumentControllerInterface } from "./DocumentControllerInterface";
import { Logger } from "pino";
import Document from "../../models/Document";
import path from "path";

@injectable()
export default class DocumentController implements DocumentControllerInterface {
  private readonly logger: Logger;

  constructor(
    @inject(TYPES.Logger)
    logger: Logger
  ) {
    this.logger = logger;
  }

  public async getAllDocuments(req: Request, res: Response): Promise<void> {
    try {
      const documents = await Document.find(); // Obtener todos los documentos de la base de datos
      res.status(200).json(documents); // Devolver los documentos en formato JSON
    } catch (error) {
      this.logger.error("Error fetching documents", error); // Usar logger para registrar el error
      res.status(500).json({ message: "Error fetching documents", error });
    }
  }

  public async getDocumentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const document = await Document.findById(id);

      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }

      res.status(200).json(document);
    } catch (error) {
      this.logger.error("Error fetching document by ID", error); // Usar logger para registrar el error
      res.status(500).json({ message: "Error fetching document", error });
    }
  }

  public async createDocument(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Asegúrate de que req.files es del tipo correcto
      console.log(files);
      const title = req.body.title;
      const description = req.body.description;
      const url = files.file[0].path;
      const campaign = req.body.campaign;
      const section = req.body.section;

      const document = new Document({
        title,
        description,
        createdAt: new Date(),
        url,
        campaign,
        section,
      });

      await document.save();

      res.status(201).json({
        message: "Document created successfully",
      });
    } catch (error) {
      this.logger.error("Error creating document", error); // Usar logger para registrar el error
      res.status(500).json({ message: "Error creating document", error });
    }
  }

  async updateDocument(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const updatedDocument = await Document.findByIdAndUpdate(
        id,
        { title, description },
        { new: true } // Devuelve el documento actualizado
      );

      if (!updatedDocument) {
        res.status(404).json({ message: "Document not found" });
        return;
      }

      res.status(200).json("Documento actualizado");
    } catch (error) {
      this.logger.error("Error updating document", error); // Usar logger para registrar el error
      res.status(500).json({ message: "Error updating document", error });
    }
  }

  async deleteDocument(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deletedDocument = await Document.findByIdAndDelete(id);

      if (!deletedDocument) {
        res.status(404).json({ message: "Document not found" });
        return;
      }

      res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      this.logger.error("Error deleting document", error); // Usar logger para registrar el error
      res.status(500).json({ message: "Error deleting document", error });
    }
  }

  async downloadDocumentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const document = await Document.findById(id);

      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }

      // Obtener la ruta absoluta al archivo
      const absolutePath = path.join(__dirname, "../../../uploads/documents", path.basename(document.url));

      // Extraer la extensión del archivo
      const fileExtension = path.extname(document.url);

      // Crear un nombre de archivo con la extensión original
      const fileNameWithExtension = `${document.title}${fileExtension}`;

      // Enviar el archivo utilizando res.download()
      res.download(absolutePath, fileNameWithExtension, (err) => {
        if (err) {
          console.error("Error downloading document", err);
          res.status(500).json({ message: "Error downloading document", error: err });
        }
      });
    } catch (error) {
      console.error("Error fetching document for download", error);
      res.status(500).json({ message: "Error fetching document for download", error });
    }
  }
}
