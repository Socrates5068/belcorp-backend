import type { Request, Response } from "express";
import User from "../models/User";

export class UserController {
  static readonly getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      console.log(error);
    }
  };
  
  static readonly getAllConsultoras = async (req: Request, res: Response) => {
    try {
      // Busca usuarios que tengan el rol de "Consultora" en su array de roles
      const consultoras = await User.find({ roles: "Consultora" });
      res.json(consultoras);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener consultoras" });
    }
  };

  static readonly getAllSocias = async (req: Request, res: Response) => {
    try {
      // Busca usuarios que tengan el rol de "Consultora" en su array de roles
      const consultoras = await User.find({ roles: "Socia" });
      res.json(consultoras);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener consultoras" });
    }
  };
  

  static readonly getUserById = async (req: Request, res: Response) => {
    const { id } = req.params; // Obtenemos el ID de los parámetros de la URL

    try {
      // Buscamos el usuario por ID
      const user = await User.findById(id);

      // Si no se encuentra el usuario, devolvemos un 404
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Devolvemos el usuario encontrado
      res.json(user);
    } catch (error) {
      console.error(error);

      // Si hay un error, probablemente por un ID no válido, devolvemos un 500
      res.status(500).json({ message: "Error al obtener el usuario" });
    }
  };

  static readonly updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, ci, ...restoDatos } = req.body;

    try {
      // Verificar si el usuario existe
      const usuario = await User.findById(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Verificar si el email ya está en uso por otro usuario
      if (email && email !== usuario.email) {
        const emailUsado = await User.findOne({ email, _id: { $ne: id } });
        if (emailUsado) {
          return res.status(400).json({ error: "El email ya está en uso" });
        }
        usuario.email = email;
      }

      // Verificar si el ci ya está en uso por otro usuario
      if (ci && ci !== usuario.ci) {
        const ciUsado = await User.findOne({ ci, _id: { $ne: id } });
        if (ciUsado) {
          return res
            .status(400)
            .json({ error: "La cédula de identidad ya está en uso" });
        }
        usuario.ci = ci;
      }

      // Actualizar el resto de los campos
      Object.assign(usuario, restoDatos);

      // Guardar los cambios
      await usuario.save();

      res.send("Usuario actualizado");
    } catch (error) {
      if (error.code === 11000) {
        const campoDuplicado = Object.keys(error.keyValue)[0];
        return res
          .status(400)
          .json({ error: `El ${campoDuplicado} ya está en uso` });
      }
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  };

  static readonly updateUserStatus = async (req: Request, res: Response) => {
    const { id } = req.params; // Obtenemos el id de los parámetros de la URL
    const { status } = req.body; // Obtenemos los datos del cuerpo de la solicitud
    try {
      // Buscamos y actualizamos el usuario por su ID
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { status }, // Los campos que queremos actualizar
        { new: true, runValidators: true } // `new: true` devuelve el documento actualizado, `runValidators` ejecuta las validaciones
      );

      // Si no se encuentra el usuario, devolvemos un 404
      if (!updatedUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Devolvemos el usuario actualizado
      await updatedUser.save();
      res.send("Usuario actualizado");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el usuario" });
    }
  };
}
