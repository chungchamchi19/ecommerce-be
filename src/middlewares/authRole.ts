import { verifyAccessToken } from "../modules/auth/services/helper";
import { NextFunction, Request, Response } from "express";
import codes from "../errors/codes";
import CustomError from "../errors/customError";
import ROLES from "../constants/roles";

const authRoleMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (req.path.includes("/admin")) {
    const user = req.user;
    if (user.role !== ROLES.ADMIN) {
      throw new CustomError(codes.FORBIDDEN);
    }
  }

  return next();
};

export default authRoleMiddleware;
