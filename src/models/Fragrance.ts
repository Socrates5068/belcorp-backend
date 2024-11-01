import mongoose, { Schema, Document as docs } from "mongoose";

// Define the interface for a fragrance document
export interface IFragrance extends docs {
  name: string;
  description?: string;
  imageUrl: string;
}

// Define the schema for a fragrance
const fragranceSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: true, // Make sure an image URL is provided
  }
});

// Create the Mongoose model from the schema
const Fragrance = mongoose.model<IFragrance>("Fragrance", fragranceSchema);

export default Fragrance;
