import mongoose, { Schema, Document as docs } from "mongoose";
import { ISection } from "./Section";
import { ICampaign } from "./Campaign";

export interface IDocument extends docs {
  title: string;
  description?: string;
  createdAt: Date;
  url: string;
  campaign: mongoose.Types.ObjectId | ICampaign; // Referencia a la campaña
  section:  mongoose.Types.ObjectId | ISection; // Referencia a la sección
}

const documentSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  url: {
    type: String,
    required: true,
  },
  campaign: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
    required: true, // Asegura que la campaña sea obligatoria
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section", // Referencia al esquema de sección
    required: true,
  },
});

const Document = mongoose.model<IDocument>("Document", documentSchema);

export default Document;
