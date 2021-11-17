import { Vendor } from "../../entities/vendor";
import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
import vendorDaos from "./daos";

const createVendor = async (vendorData: Vendor) : Promise<Vendor> => {
    return await vendorDaos.createVendor(vendorData);
}

const getVendorById = async (id: number): Promise<Vendor> => {
    return await vendorDaos.getVendorById(id);
};

const updateVendor = async (id: number, vendorData: Vendor): Promise<Vendor> => {
    const updateVendor = await vendorDaos.getVendorById(id);
    if (!updateVendor){
        throw new CustomError(codes.NOT_FOUND, "Vendor not found!");
    }
    delete vendorData.id;
    const newVendor = {
        ...updateVendor,
        ...vendorData,
    };
    vendorDaos.updateVendor(id, vendorData);
    return newVendor;
};

const deleteVendor = async(id: number) => {
    const findVendor = await getVendorById(id);
    vendorDaos.deleteVendor(id);
    return findVendor;
}

const vendorServices = {
    createVendor,
    getVendorById,
    updateVendor,
    deleteVendor,
}

export default vendorServices;