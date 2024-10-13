import mongoose, { Schema, Document as docs } from "mongoose";

export interface IDocument extends docs {
  title: string;
  description?: string;
  createdAt: Date;
  url: string; // Nueva propiedad para la URL del documento
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
    required: true, // Asegura que la URL sea obligatoria
  },
});

const Document = mongoose.model<IDocument>("Document", documentSchema);

export default Document;
