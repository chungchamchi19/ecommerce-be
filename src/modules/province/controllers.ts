import { Request, Response } from "express";
import provinceServices from "./services";

const getList = async (req: Request, res: Response) => {
  const provices = await provinceServices.getList();
  return res.status(200).json({
    status: "success",
    result: provices,
  });
};

const provinceControllers = {
  getList,
};

export default provinceControllers;
