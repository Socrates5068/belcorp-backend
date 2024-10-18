import mongoose, { Schema, Document as docs } from "mongoose";
import { ICampaign } from "./campaign";

export interface IDocument extends docs {
  title: string;
  description?: string;
  createdAt: Date;
  url: string;
  campaign: mongoose.Types.ObjectId | ICampaign; // Referencia a la campaña
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
});

const Document = mongoose.model<IDocument>("Document", documentSchema);

export default Document;
