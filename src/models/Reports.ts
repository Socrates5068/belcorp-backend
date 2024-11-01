import mongoose, { Schema, Document } from "mongoose";

// Define la interfaz para el documento de Report
export interface IReport extends Document {
  name: string;
  creationDate: Date;
  reportType: string;
  userId: string;
  fileUrl: string;
}

// Define el esquema del reporte
const reportSchema: Schema = new Schema({
  name: {
    type: String,
    required: true, // Name is required
  },
  creationDate: {
    type: Date,
    required: true, // Creation date is required
  },
  reportType: {
    type: String,
    required: true, // Report type is required
  },
  userId: {
    type: String,
    required: true, // User ID is required
  },
  fileUrl: {
    type: String,
    required: true, // File URL is required
  },
});

// Crea el modelo de Report basado en el esquema
const Report = mongoose.model<IReport>("Report", reportSchema);

export default Report;
