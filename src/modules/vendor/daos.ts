import { getRepository } from "typeorm";
import { Vendor } from "../../entities/vendor";
import { Pagination } from "../../types/type.pagination";
import mediaDaos from "../media/daos";

const createVendor = async (vendorData: Vendor): Promise<Vendor> => {
  const vendorRepo = getRepository(Vendor);
  let newVendor = new Vendor();
  newVendor = vendorData;
  return await vendorRepo.save(newVendor);
};

const getVendors = async (params: { pagination: Pagination }): Promise<Vendor[]> => {
  const vendorRepo = getRepository(Vendor);
  const vendors = await vendorRepo
    .createQueryBuilder("v")
    .leftJoinAndSelect("v.products", "p")
    .skip(params.pagination.offset)
    .take(params.pagination.limit)
    .getMany();
  return vendors;
};

const getVendorById = async (id: number): Promise<Vendor> => {
  const vendorRepo = getRepository(Vendor);
  const vendor = await vendorRepo
    .createQueryBuilder("v")
    .leftJoinAndSelect("v.products", "p")
    .where(`v.id=${id}`)
    .getOne();
  return vendor;
};

const updateVendor = async (id: number, data: Vendor): Promise<Vendor> => {
  const vendorRepo = getRepository(Vendor);
  await vendorRepo.update(id, data);
  return data;
};

const deleteVendor = async (id: number) => {
  const vendorRepo = getRepository(Vendor);
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
