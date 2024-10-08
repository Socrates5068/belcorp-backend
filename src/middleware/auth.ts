import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser, UserRole } from "../models/User";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Utilidad para verificar el token y obtener el usuario
const verifyTokenAndGetUser = async (req: Request): Promise<IUser | null> => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    throw new Error("No Autorizado");
  }

  const [, token] = bearer.split(" ");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (typeof decoded === "object" && decoded.id) {
    const user = await User.findById(decoded.id).select("_id roles");
    return user || null;
  }

  throw new Error("Token No Válido");
};

/*
 * Middleware para verificar si el usuario está autenticado
 */
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await verifyTokenAndGetUser(req);
    if (!user) {
      return res.status(401).json({ error: "Token No Válido" });
    }

    req.user = user; // Asigna el usuario autenticado a la solicitud
    next(); // Continúa con la siguiente función
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

/*
 * Middleware para verificar si el usuario tiene el rol de Gerente o Admin
 */
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await verifyTokenAndGetUser(req);
    if (!user.roles.includes(UserRole.Gerente)) {
      return res.status(403).json({ error: "Acceso Denegado" });
    }

    req.user = user; // Asigna el usuario autenticado a la solicitud
    next(); // Continúa con la siguiente función
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
