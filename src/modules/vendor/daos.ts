import { appDataSource } from "./../../database/connectDB";
import { Vendor } from "../../entities/vendor";
import { Pagination } from "../../types/type.pagination";

const createVendor = async (vendorData: Vendor): Promise<Vendor> => {
  const vendorRepo = appDataSource.getRepository(Vendor);
  const newVendor = vendorRepo.create(vendorData);
  return await vendorRepo.save(newVendor);
};

const getVendors = async (params: { pagination: Pagination }): Promise<{ vendors: Vendor[]; total: number }> => {
  const vendorRepo = appDataSource.getRepository(Vendor);
  let vendorQuery = await vendorRepo.createQueryBuilder("v").orderBy("v.createdAt", "DESC");
  const vendors = await vendorQuery.skip(params.pagination.offset).take(params.pagination.limit).getMany();
  const total = await vendorQuery.getCount();
  return {
    vendors,
    total,
  };
};

const getVendorById = async (id: number): Promise<Vendor> => {
  const vendorRepo = appDataSource.getRepository(Vendor);
  const vendor = await vendorRepo.findOne({ where: { id } });
  return vendor;
};

const updateVendor = async (id: number, data: Vendor): Promise<Vendor> => {
  const vendorRepo = appDataSource.getRepository(Vendor);
  await vendorRepo.update(id, data);
  return data;
};

const deleteVendor = async (id: number) => {
  const vendorRepo = appDataSource.getRepository(Vendor);
  await vendorRepo.delete(id);
};

const vendorDaos = {
  createVendor,
  getVendorById,
  getVendors,
  updateVendor,
  deleteVendor,
};

export default vendorDaos;
