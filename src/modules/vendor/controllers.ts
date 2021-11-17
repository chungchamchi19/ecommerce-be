import { Request, Response } from "express";
import vendorServices from "../vendor/services";
import { Vendor } from "../../entities/vendor";

const createVendor = async (req: Request, res: Response) => {
  const {name} = req.body;
  const vendorData : Vendor = {name};
  const newVendor = await vendorServices.createVendor(vendorData);
  res.status(200).json({
    status: "success",
    result: newVendor,
  });
};

const getVendorById = async (req: Request, res: Response) => {
    const {id} = req.params;
    const vendor = await vendorServices.getVendorById(Number(id));
    res.status(200).json({
        status: "success",
        result: vendor,
    });
};

const updateVendor = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const vendor = await vendorServices.updateVendor(Number(id), data);
    res.status(200).json({
      status: "success",
      result: vendor,
    });
  };

const deleteVendor = async (req: Request, res: Response) => {
    const { id } = req.params;
    const vendor = await vendorServices.deleteVendor(Number(id));
    res.status(200).json({
      status: "success",
      result: vendor,
    });
  };

const vendorControllers = {
    createVendor,
    getVendorById,
    updateVendor,
    deleteVendor,
};

export default vendorControllers;