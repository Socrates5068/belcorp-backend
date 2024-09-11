import mongoose, { Schema, Document } from "mongoose";

export enum UserStatus {
  Active = "Active",
  Inactive = "Inactive",
  Pending = "Pending",
  Banned = "Banned",
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  lastName: string;
  ci: string;
  confirmed: boolean;
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  ci: {
    type: String,
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "Inactive",
  },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
