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
}
