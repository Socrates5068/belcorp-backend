import mongoose, { Schema, Document } from "mongoose";

// Define la interfaz para el documento de Conference
export interface IConference extends Document {
  name: string;
  date: Date;
}

// Define el esquema de la conferencia
const conferenceSchema: Schema = new Schema({
  name: {
    type: String,
    required: true, // Name is required
  },
  date: {
    type: Date,
    required: true, // Date is required
  },
});

// Crea el modelo de Conference basado en el esquema
const Conference = mongoose.model<IConference>("Conference", conferenceSchema);

export default Conference;
