import { NextFunction, Request, Response } from "express";
import codes from "../errors/codes";
import CustomError from "../errors/customError";

export const validatePermissionProducts = (role: String) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      throw new CustomError(codes.FORBIDDEN);
    }
    next();
  };
};
