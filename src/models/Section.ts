import mongoose, { Schema, Document } from "mongoose";

export interface ISection extends Document {
  name: string;
}

const sectionSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Asegura que cada sección tenga un nombre único
  },
});

const Section = mongoose.model<ISection>("Section", sectionSchema);

export default Section;
