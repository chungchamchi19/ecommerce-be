import { Request, Response } from "express";
import wardServices from "./services";

const getList = async (req: Request, res: Response) => {
  const districtId = req.query.districtId;
  const wards = await wardServices.getList(String(districtId));
  return res.status(200).json({
    status: "success",
    result: wards,
  });
};

const wardControllers = {
  getList,
};

export default wardControllers;
