import { NextFunction, Request, Response } from "express";

const asyncMiddleware = (fn: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (e) {
      next(e);
    }
  };
};

export default asyncMiddleware;
