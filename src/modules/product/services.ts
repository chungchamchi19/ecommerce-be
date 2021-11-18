import { MediaMap } from "./../../entities/mediaMap";
import { Pagination } from "./../../types/type.pagination";
import { Product } from "./../../entities/product";
import { convertToSlug } from "../../utils/convertToSlug";
import productDaos from "./daos";
import configs from "../../configs";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import { Media } from "../../entities/media";
import mediaMapServices from "../mediaMap/services";
import variantServices from "../variant/services";
import { Variant } from "../../entities/variant";
import optionServices from "../option/services";
import { Option } from "../../entities/option";
import optionValueServices from "../optionValue/services";
import optionValueVariantServices from "../optionValueVariant/services";

const createProduct = async (product: Product) => {
  const cacheAvailableNumber = product.availableNumber;
  const cacheProductOptions = product.options;
  delete product.availableNumber;
  delete product.options;
  if (product.featureImageId && product.media) {
    checkProductMedia(product.media, product.featureImageId);
  }
  const productData: Product = product;
  if (!productData.url) {
    const countProductByUrl: number = await productDaos.countProducts({ title: productData.title });
    if (countProductByUrl) {
      productData.url = convertToSlug(productData.title + " " + countProductByUrl);
    } else {
      productData.url = convertToSlug(productData.title);
    }
  }
  // cache lai media
  const cacheMedia = product.media;
  delete product.media;
  // create new product
  const newProduct = await productDaos.createProduct(productData);
  // auto create variants
  const variants = await createVariants(newProduct, cacheAvailableNumber, cacheProductOptions);
  // update media for product
  const listCreateMediaMap: MediaMap[] = cacheMedia.map((media: Media) => {
    return {
      mediaId: media.id,
      targetId: newProduct.id,
      targetType: "product",
    };
  });
  const listMediaMaps = await mediaMapServices.createMediaMaps(listCreateMediaMap);
  const featureImageMap = listMediaMaps.find((mediaMap: MediaMap) => mediaMap?.media?.id === newProduct.featureImageId);
  const listMedia = listMediaMaps.map((mediaMap: MediaMap) => {
    return mediaMap.media;
  });
  return {
    ...newProduct,
    media: listMedia,
    featureImage: featureImageMap.media,
    variants: variants,
  };
};

const createVariants = async (
  newProduct: Product,
  cacheAvailableNumber: number,
  createOptions: Option[],
): Promise<Variant[]> => {
  let variants = [];
  const newVariant: Variant = {
    price: newProduct.price,
    comparePrice: newProduct.comparePrice,
    featureImageId: newProduct.featureImageId,
    availableNumber: cacheAvailableNumber,
    productId: newProduct.id,
  };
  if (!createOptions || !createOptions?.length) {
    const createdVariant = await variantServices.createVariant(newVariant);
    variants.push(createdVariant);
  } else {
    const newOptions: { [key: string]: Option } = {};
    // insert options
    for (let i = 0; i < createOptions.length; i++) {
      const option = createOptions[i];
      const newOption = await optionServices.createOption({
        position: i + 1,
        productId: newProduct.id,
        title: option.title,
      });
      newOptions[i + 1] = newOption;
    }
    // insert option_value và variant
    if (createOptions.length === 1) {
      for (let i = 0; i < createOptions[0].optionValues?.length; i++) {
        const optionValue1 = createOptions[0].optionValues[i];
        // create option_value
        const newOptionsValue1 = await optionValueServices.createOptionValue({
          value: optionValue1.value,
          optionId: newOptions[1].id,
        });
        // create record variant
        const createdVariant = await variantServices.createVariant(newVariant);
        // create record option_value_variant
        await optionValueVariantServices.createOptionValueVariant({
          optionValueId: newOptionsValue1.id,
          variantId: createdVariant.id,
        });
      }
    }
    if (createOptions.length === 2) {
      for (let i = 0; i < createOptions[0].optionValues?.length; i++) {
        const optionValue1 = createOptions[0].optionValues[i];
        const newOptionsValue1 = await optionValueServices.createOptionValue({
          value: optionValue1.value,
          optionId: newOptions[1].id,
        });
        for (let j = 0; j < createOptions[1].optionValues?.length; j++) {
          const optionValue2 = createOptions[1].optionValues[j];
          // create option_value
          const newOptionsValue2 = await optionValueServices.createOptionValue({
            value: optionValue2.value,
            optionId: newOptions[2].id,
          });
          // create variant
          const createdVariant = await variantServices.createVariant(newVariant);
          // create record option_value_variant
          await optionValueVariantServices.createOptionValueVariant({
            optionValueId: newOptionsValue1.id,
            variantId: createdVariant.id,
          });
          await optionValueVariantServices.createOptionValueVariant({
            optionValueId: newOptionsValue2.id,
            variantId: createdVariant.id,
          });
        }
      }
    }
    if (createOptions.length === 3) {
      for (let i = 0; i < createOptions[0].optionValues?.length; i++) {
        const optionValue1 = createOptions[0].optionValues[i];
        const newOptionsValue1 = await optionValueServices.createOptionValue({
          value: optionValue1.value,
          optionId: newOptions[1].id,
        });
        for (let j = 0; j < createOptions[1].optionValues?.length; j++) {
          const optionValue2 = createOptions[1].optionValues[j];
          // create option_value
          const newOptionsValue2 = await optionValueServices.createOptionValue({
            value: optionValue2.value,
            optionId: newOptions[2].id,
          });
          for (let k = 0; k < createOptions[2].optionValues?.length; k++) {
            const optionValue3 = createOptions[2].optionValues[k];
            // create option_value
            const newOptionsValue3 = await optionValueServices.createOptionValue({
              value: optionValue3.value,
              optionId: newOptions[3].id,
            });
            // create variant
            const createdVariant = await variantServices.createVariant(newVariant);
            // create record option_value_variant
            await optionValueVariantServices.createOptionValueVariant({
              optionValueId: newOptionsValue1.id,
              variantId: createdVariant.id,
            });
            await optionValueVariantServices.createOptionValueVariant({
              optionValueId: newOptionsValue2.id,
              variantId: createdVariant.id,
            });
            await optionValueVariantServices.createOptionValueVariant({
              optionValueId: newOptionsValue3.id,
              variantId: createdVariant.id,
            });
          }
        }
      }
    }
  }
  return variants;
};

const getProducts = async (params: { pagination: Pagination }): Promise<Product[]> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  let listProduct = await productDaos.getProducts({ pagination });
  listProduct = listProduct.map((product: Product) => {
    product.media = product.mediaMaps.map((mediaMap: MediaMap) => mediaMap.media);
    delete product.mediaMaps;
    return {
      ...product,
      media: formatMedia(product.featureImage, product.media),
    };
  });
  return listProduct;
};

const getProductById = async (id: number): Promise<Product> => {
  const findProduct = await productDaos.getProductById(id);
  if (!findProduct) {
    throw new CustomError(codes.NOT_FOUND, "Product not found!");
  }
  findProduct.media = findProduct.mediaMaps.map((mediaMap: MediaMap) => mediaMap.media);
  const media = formatMedia(findProduct.featureImage, findProduct.media);
  delete findProduct.mediaMaps;
  return {
    ...findProduct,
    media,
  };
};

const updateProduct = async (id: number, data: Product): Promise<Product> => {
  const findProduct = await getProductById(id);
  delete data.id;
  if (data.featureImageId && data.media) {
    checkProductMedia(data.media, data.featureImageId);
  }
  if (data.media && !data.featureImageId && !data.media.find((item) => item.id === findProduct.featureImageId)) {
    throw new CustomError(codes.BAD_REQUEST, "Feature image id should have in media list!");
  }
  if (data.featureImageId) {
    if (findProduct.featureImageId !== data.featureImageId) {
      findProduct.featureImageId && (await mediaMapServices.deleteMediaMapById(findProduct.featureImageId));
      mediaMapServices.createMediaMaps([
        {
          mediaId: data.featureImageId,
          targetType: "product",
          targetId: findProduct.id,
        },
      ]);
    }
  }
  if (data.media) {
    const currentMedia = findProduct.media;
    const deleteMedia = currentMedia
      .filter((media: Media) => {
        return !data.media.find((item) => item.id === media.id);
      })
      .map((item: Media) => {
        return item.id;
      });
    const addMedia: MediaMap[] = data.media
      .filter((media: Media) => {
        return !currentMedia.find((item) => item.id === media.id);
      })
      .map((item: Media) => {
        return {
          mediaId: item.id,
          targetType: "product",
          targetId: findProduct.id,
        };
      });
    // delete media
    mediaMapServices.deleteMediaMapsByListId(deleteMedia);
    // update media
    mediaMapServices.createMediaMaps(addMedia);
    delete data.media;
  }
  await productDaos.updateProduct(id, data);
  return await getProductById(id);
};

const deleteProduct = async (id: number) => {
  const findProduct = await getProductById(id);
  productDaos.deleteProduct(id);
  return findProduct;
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

const productServices = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById,
};

export default productServices;
