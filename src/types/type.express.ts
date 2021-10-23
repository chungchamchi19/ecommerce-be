import { Request } from "express";
import { User } from "../entities/user";

declare global {
  namespace Express {
    export interface Request {
      user: User;
      accessToken: string;
    }
  }
}
