import { Variant } from "../../entities/variant";
import variantDaos from "./daos";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import { Option } from "../../entities/option";
import { OptionValue } from "../../entities/optionValue";
import optionValueServices from "../optionValue/services";
import optionValueVariantServices from "../optionValueVariant/services";
import { OptionValueVariant } from "../../entities/optionValueVariant";
import productDaos from "../product/daos";
import productHelpers from "../product/helpers";
import variantHelpers from "./helpers";

const getVariantById = async (id: number): Promise<Variant> => {
  const findvariant = await variantDaos.getVariantById(id);
  if (!findvariant) {
    throw new CustomError(codes.NOT_FOUND, "Variant not found!");
  }
  return variantHelpers.formatVariant(findvariant);
};
const getVariantWithProductById = async (id: number): Promise<Variant> => {
  const findvariant = await variantDaos.getVariantWithProductById(id);
  if (!findvariant) {
    throw new CustomError(codes.NOT_FOUND, "Variant not found!");
  }
  return variantHelpers.formatVariant(findvariant);
};

const createVariant = async (data: Variant): Promise<Variant> => {
  const cacheOptions = data.options;
  delete data.options;
  let newVariant;
  if (cacheOptions) {
    const product = await productDaos.getProductById(data.productId);
    const formatProduct = productHelpers.formatProductResponse(product);
    if (cacheOptions.length !== formatProduct.options.length) {
      throw new CustomError(codes.BAD_REQUEST, "Variant should have number of options similar to its product!");
    }
    // nếu tồn tại variant rồi thì bỏ qua
    for (let i = 0; i < formatProduct.variants?.length; i++) {
      const variant = formatProduct.variants[i];
      if (variant.publicTitle === cacheOptions.join(" / ")) {
        throw new CustomError(codes.BAD_REQUEST, "Variant existed!");
      }
    }
    // chưa có thì tạo mới
    newVariant = await variantDaos.createVariant(data);
    for (let i = 0; i < cacheOptions.length; i++) {
      if (product.options.length > i) {
        const option: string = cacheOptions[i];
        let findOption: OptionValue;
        await product?.options?.forEach(async (productOption: Option) => {
          await productOption?.optionValues?.forEach((prodOptionVal: OptionValue) => {
            if (prodOptionVal.value === option) {
              findOption = prodOptionVal;
            }
          });
        });
        // nếu không tìm thấy optionValue có sẵn trong product thì tạo mới
        if (!findOption) {
          const currentOptionProduct = product.options[i];
          const newOptionValue = await optionValueServices.createOptionValue({
            value: option,
            optionId: currentOptionProduct.id,
          });
          await optionValueVariantServices.createOptionValueVariant({
            optionValueId: newOptionValue.id,
            variantId: newVariant.id,
          });
        } else {
          // nếu tìm thấy thì insert vào bảng option_value_variant
          await optionValueVariantServices.createOptionValueVariant({
            optionValueId: findOption.id,
            variantId: newVariant.id,
          });
        }
      }
    }
  } else {
    newVariant = await variantDaos.createVariant(data);
  }
  return await getVariantById(newVariant.id);
};

const updateVariant = async (id: number, data: Variant): Promise<Variant> => {
  const findVariant = await variantDaos.getVariantById(id);
  if (data.productId !== findVariant.productId) {
    throw new CustomError(codes.BAD_REQUEST, "Variant is not belong to this product!");
  }
  if (!findVariant) {
    throw new CustomError(codes.NOT_FOUND, "Variant not found!");
  }
  const cacheOptions = data.options;
  delete data.options;
  delete data.id;
  if (cacheOptions) {
    const product = await productDaos.getProductById(data.productId);
    const formatProduct = productHelpers.formatProductResponse(product);
    const formatVariant = variantHelpers.formatVariant(findVariant);
    if (cacheOptions.length !== formatProduct.options.length) {
      throw new CustomError(codes.BAD_REQUEST, "Variant should have number of options similar to its product!");
    }
    // nếu tồn tại variant rồi thì bỏ qua
    if (cacheOptions.join(" / ") !== formatVariant.publicTitle) {
      for (let i = 0; i < formatProduct.variants?.length; i++) {
        const variant = formatProduct.variants[i];
        if (variant.publicTitle === cacheOptions.join(" / ")) {
          throw new CustomError(codes.BAD_REQUEST, "Variant existed!");
        }
      }
    }
    await variantDaos.updateVariant(id, data);
    const deleteOptionValues = findVariant.optionValueVariants
      .filter((ovv: OptionValueVariant) => !cacheOptions.find((item: string) => item === ovv.optionValue.value))
      .map((ovv: OptionValueVariant) => {
        return ovv.optionValue.value;
      });
    const addOptionValues = cacheOptions.filter((item: string) => !findVariant.optionValueVariants.find((ovv: OptionValueVariant) => item === ovv.optionValue.value));
    // add option_value_variant records
    for (let i = 0; i < addOptionValues.length; i++) {
      if (product.options.length > i) {
        const option: string = addOptionValues[i];
        let findOption: OptionValue;
        await product?.options?.forEach(async (productOption: Option) => {
          await productOption?.optionValues?.forEach((prodOptionVal: OptionValue) => {
            if (prodOptionVal.value === option) {
              findOption = prodOptionVal;
            }
          });
        });
        // nếu không tìm thấy optionValue có sẵn trong product thì tạo mới
        if (!findOption) {
          const currentOptionProduct = product.options[i];
          const newOptionValue = await optionValueServices.createOptionValue({
            value: option,
            optionId: currentOptionProduct.id,
          });
          await optionValueVariantServices.createOptionValueVariant({
            optionValueId: newOptionValue.id,
            variantId: id,
          });
        } else {
          // nếu tìm thấy thì insert vào bảng option_value_variant
          await optionValueVariantServices.createOptionValueVariant({
            optionValueId: findOption.id,
            variantId: id,
          });
        }
      }
    }
    // delete option_value_variant records
    for (let i = 0; i < deleteOptionValues.length; i++) {
      const option: string = deleteOptionValues[i];
      let findOption: OptionValue;
      product?.options?.forEach((productOption: Option) => {
        productOption?.optionValues?.forEach((prodOptionVal: OptionValue) => {
          if (prodOptionVal.value === option) {
            findOption = prodOptionVal;
          }
        });
      });
      await optionValueVariantServices.deleteOptionValueVariants({
        optionValueId: findOption.id,
        variantId: id,
      });
    }
  } else {
    await variantDaos.updateVariant(id, data);
  }
  return await getVariantById(findVariant.id);
};

const deleteVariantByIds = async (ids: number[]) => {
  if (!ids.length) {
    throw new CustomError(codes.BAD_REQUEST, "Missing list id to delete!");
  }
  await variantDaos.deleteVariantByIds(ids);
};

const deleteVariantById = async (id: number) => {
  const findVariant = await getVariantById(id);
  if (!findVariant) {
    throw new CustomError(codes.NOT_FOUND, "Variant not found!");
  }
  await variantDaos.deleteVariant(id);
  return findVariant;
};

const variantServices = {
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariantByIds,
  deleteVariantById,
  getVariantWithProductById
};

export default variantServices;
