import { Vendor } from "../../entities/vendor";
import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
import vendorDaos from "./daos";
import { Pagination } from "./../../types/type.pagination";
import configs from "../../configs";

const createVendor = async (vendorData: Vendor): Promise<Vendor> => {
  return await vendorDaos.createVendor(vendorData);
};

const getVendorById = async (id: number): Promise<Vendor> => {
  const vendor = await vendorDaos.getVendorById(id);
  if (!vendor) {
    throw new CustomError(codes.NOT_FOUND, "Vendor not found");
  } else {
    return vendor;
  }
};

const getVendors = async (params: { pagination: Pagination }): Promise<{ vendors: Vendor[]; total: number }> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  return await vendorDaos.getVendors({ pagination });
};

const updateVendor = async (id: number, vendorData: Vendor): Promise<Vendor> => {
  const updateVendor = await vendorDaos.getVendorById(id);
  if (!updateVendor) {
    throw new CustomError(codes.NOT_FOUND, "Vendor not found!");
  }
  delete vendorData.id;
  const newVendor = {
    ...updateVendor,
    ...vendorData,
  };
  await vendorDaos.updateVendor(id, vendorData);
  return newVendor;
};

const deleteVendor = async (id: number) => {
  const findVendor = await getVendorById(id);
  if (!findVendor) {
    throw new CustomError(codes.NOT_FOUND, "Vendor not found");
  } else {
    await vendorDaos.deleteVendor(id);
    return findVendor;
  }
};

const vendorServices = {
  createVendor,
  getVendorById,
  getVendors,
  updateVendor,
  deleteVendor,
};

export default vendorServices;
