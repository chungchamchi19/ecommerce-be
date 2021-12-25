import { Request, Response } from "express";
import districtServices from "./services";

const getList = async (req: Request, res: Response) => {
  const provinceId = req.query.provinceId;
  const districts = await districtServices.getList(String(provinceId));
  return res.status(200).json({
    status: "success",
    result: districts,
  });
};

const districtControllers = {
  getList,
};

export default districtControllers;
