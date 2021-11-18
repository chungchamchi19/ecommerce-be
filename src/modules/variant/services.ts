import { Variant } from "../../entities/variant";
import variantDaos from "./daos";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";

const getVariantById = async (id: number): Promise<Variant> => {
  const findvariant = await variantDaos.getVariantById(id);
  if (!findvariant) {
    throw new CustomError(codes.NOT_FOUND, "variant not found!");
  }
  return findvariant;
};

const variantServices = {
  getVariantById,
};

export default variantServices;
