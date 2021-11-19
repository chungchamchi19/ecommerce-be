import { Media } from "../../entities/media";
import { MediaMap } from "../../entities/mediaMap";
import { Option } from "../../entities/option";
import { OptionValue } from "../../entities/optionValue";
import { OptionValueVariant } from "../../entities/optionValueVariant";
import { Product } from "../../entities/product";
import { Variant } from "../../entities/variant";
import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
import { ProductResponse } from "../../types/type.product";
import { VariantResponse } from "../../types/type.variant";

const formatProductResponse = (product: Product): ProductResponse => {
  // format options
  const formatOptions = product.options.map((option: Option) => {
    const newOptionValues = option.optionValues.map((optionVal: OptionValue) => optionVal.value);
    delete option.optionValues;
    return {
      ...option,
      values: newOptionValues,
    };
  });
  // format media
  let formatMediaProd = product.mediaMaps.map((mediaMap: MediaMap) => {
    return mediaMap.media;
  });
  formatMediaProd = formatMedia(product.featureImage, formatMediaProd);
  // format variants
  const formatVariants: VariantResponse[] = product.variants.map((variant: Variant) => {
    const newOptionValues = variant.optionValueVariants.map((optionValVar: OptionValueVariant) => {
      return {
        value: optionValVar?.optionValue?.value,
        position: optionValVar?.optionValue?.option?.position,
      };
    });
    const newOptions: string[] = newOptionValues
      .sort((left, right) => left.position - right.position)
      .map((item) => item.value);
    delete variant.optionValueVariants;
    return {
      ...variant,
      options: newOptions,
      option1: newOptions.length >= 1 ? newOptions[0] : null,
      option2: newOptions.length >= 2 ? newOptions[1] : null,
      option3: newOptions.length >= 3 ? newOptions[2] : null,
      available: Number(variant.availableNumber) > 0,
      publicTitle: newOptions.join(" / "),
    };
  });
  // format product
  delete product.mediaMaps;
  const formatProduct: ProductResponse = {
    ...product,
    options: formatOptions,
    media: formatMediaProd,
    variants: formatVariants,
  };
  return formatProduct;
};

const formatMedia = (featureImage: Media, media: Media[]) => {
  if (featureImage && media) {
    return [featureImage, ...media.filter((item: Media) => item?.id !== featureImage?.id)];
  }
  return media;
};

const checkProductMedia = (media: Media[], featureImageId: number) => {
  if (!media.find((item) => item.id === featureImageId)) {
    throw new CustomError(codes.BAD_REQUEST, "Feature image id should have in media list!");
  }
};

const productHelpers = { formatProductResponse, checkProductMedia };

export default productHelpers;
