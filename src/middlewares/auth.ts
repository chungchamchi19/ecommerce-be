import { NextFunction, Request, Response } from "express";
import codes from "../errors/codes";
import CustomError from "../errors/customError";
import { verifyAccessToken } from "../modules/auth/services/helper";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (apiCheckAuth(req.path, req.method?.toLocaleLowerCase())) {
    const { authorization } = req.headers;
    if (!authorization) throw new CustomError(codes.UNAUTHORIZED);

    const [tokenType, accessToken] = authorization.split(" ");

    if (tokenType !== "Bearer") throw new CustomError(codes.UNAUTHORIZED);

    const user = await verifyAccessToken(accessToken);
    req.user = user;
    if (["/auths/logout", "/auths/verify"].includes(req.path)) {
      req.accessToken = accessToken;
    }
  }

  return next();
};

const apiCheckAuth = (path: string, method: string) => {
  // method != get thì check auth
  if (method !== "get" && !path.includes("/auth")) {
    return true;
  }
  // những api liên quan tới những bảng sau thì cần check auth
  const checkApis = ["/cart", "/orders", "/cart-items", "/order-items", "/admin", "/me", "/user-metas"];
  const findPath = checkApis.find((api) => path.includes(api));
  if (findPath) {
    return true;
  }
  return false;
};

export default authMiddleware;
