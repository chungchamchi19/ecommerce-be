import { getRepository } from "typeorm";
import { Vendor } from "../../entities/vendor";
import mediaDaos from "../media/daos";

const createVendor = async (vendorData: Vendor): Promise<Vendor> => {
    const vendorRepo = getRepository(Vendor);
    let newVendor = new Vendor();
    newVendor = vendorData;
    return await vendorRepo.save(newVendor);
};

const getVendorById = async(id: number): Promise<Vendor> => {
    const vendorRepo = getRepository(Vendor);
    const vendor = await vendorRepo
        .createQueryBuilder("v")
        .leftJoinAndSelect("v.product", "p", `p.vendor_id='vendor'`)
        .where(`v.id=${id}`)
        .getOne();
    return vendor;
}

const updateVendor = async( id: number, data: Vendor): Promise<Vendor> => {
    const vendorRepo = getRepository(Vendor);
    await vendorRepo.update(id, data);
    return data;
}

const deleteVendor = async ( id: number) => {
    const vendorRepo = getRepository(Vendor);
    await vendorRepo.delete(id);
}

const vendorDaos = {
    createVendor,
    getVendorById,
    updateVendor,
    deleteVendor,
};

export default vendorDaos;