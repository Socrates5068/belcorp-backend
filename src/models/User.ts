import mongoose, { Schema, Document } from "mongoose";
import { ISection } from "./Section";

export enum UserRole {
  administrador = "Administrador",
  gerente = "Gerente",
  socia = "Socia",
  consultora = "Consultora",
}

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
  roles: UserRole[]; // Múltiples roles
  section:  mongoose.Types.ObjectId | ISection; // Referencia a la sección
  status: UserStatus;
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
    unique: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  roles: {
    type: [String],
    enum: Object.values(UserRole), // Acepta solo los valores del enum
    default: [UserRole.socia], // Rol por defecto
    required: true,
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section", // Referencia al esquema de sección
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.Inactive,
  },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
