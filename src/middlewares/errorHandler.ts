import { NextFunction, Request, Response } from "express";

// eslint-disable-next-line no-unused-vars
const errorHandler = (
  err: { code: number; statusCode: number; details: any; message: any },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("err", err);
  let statusCode = Number(err.code) || Number(err.statusCode) || 400;
  let { message } = err;
  let details;
  // const code = err.code || err.statusCode || codes.INTERNAL_SERVER_ERROR;
  return res.status(statusCode).json({
    status: "fail",
    message: message,
    statusCode: statusCode,
    details: details,
  });
};

export default errorHandler;
