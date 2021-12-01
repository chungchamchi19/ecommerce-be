import { Variant } from "../../entities/variant";
import variantDaos from "./daos";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import productServices from "../product/services";
import { Option } from "../../entities/option";
import { OptionValue } from "../../entities/optionValue";
import optionValueServices from "../optionValue/services";
import optionValueVariantServices from "../optionValueVariant/services";
import { OptionValueVariant } from "../../entities/optionValueVariant";

const getVariantById = async (id: number): Promise<Variant> => {
  const findvariant = await variantDaos.getVariantById(id);
  if (!findvariant) {
    throw new CustomError(codes.NOT_FOUND, "Variant not found!");
  }
  return findvariant;
};

const createVariant = async (data: Variant): Promise<Variant> => {
  const cacheOptions = data.options;
  delete data.options;
  const newVariant = await variantDaos.createVariant(data);
  if (cacheOptions) {
    const product = await productServices.getProductById(data.productId);
    for (let i = 0; i < cacheOptions.length; i++) {
      if (product.options.length > i) {
        const option: string = cacheOptions[i];
        let findOption: OptionValue;
        product?.options?.forEach((productOption: Option) => {
          productOption?.optionValues?.forEach((prodOptionVal: OptionValue) => {
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
  }
  return newVariant;
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
  await variantDaos.updateVariant(id, data);
  if (cacheOptions) {
    const product = await productServices.getProductById(data.productId);
    const deleteOptionValues = findVariant.optionValueVariants
      .filter((ovv: OptionValueVariant) =>
        cacheOptions.find((item: string) => {
          item !== ovv.optionValue.value;
        }),
      )
      .map((ovv: OptionValueVariant) => {
        return ovv.optionValue.value;
      });
    const addOptionValues = cacheOptions.filter((item: string) =>
      findVariant.optionValueVariants.find((ovv: OptionValueVariant) => {
        item !== ovv.optionValue.value;
      }),
    );
    // add option_value_variant records
    for (let i = 0; i < addOptionValues.length; i++) {
      if (product.options.length > i) {
        const option: string = addOptionValues[i];
        let findOption: OptionValue;
        product?.options?.forEach((productOption: Option) => {
          productOption?.optionValues?.forEach((prodOptionVal: OptionValue) => {
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
  }
  return {
    ...findVariant,
    ...data,
  };
};

const variantServices = {
  getVariantById,
  createVariant,
  updateVariant,
};

export default variantServices;
