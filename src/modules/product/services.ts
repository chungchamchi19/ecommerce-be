import { MediaMap } from "./../../entities/mediaMap";
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
import { ProductResponse, ProductSearchParams } from "../../types/type.product";
import productHelpers from "./helpers";
import { OptionValue } from "../../entities/optionValue";
import productCollectionServices from "../productCollection/services";
import collectionServices from "../collection/services";

/**
 * createProduct service tạo product
 * @param product data product
 * @returns ProductReponse
 */
const createProduct = async (product: Product): Promise<ProductResponse> => {
  const cacheAvailableNumber = product.availableNumber;
  const cacheProductOptions = product.options;
  const cacheCollections = product.collections;
  delete product.collections;
  delete product.availableNumber;
  delete product.options;
  if (product.featureImageId && product.media) {
    productHelpers.checkProductMedia(product.media, product.featureImageId);
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
  // create product_collection
  if (cacheCollections && cacheCollections.length) {
    for (let i = 0; i < cacheCollections.length; i++) {
      const collectionId = cacheCollections[i];
      await productCollectionServices.createProductCollection({
        productId: newProduct.id,
        collectionId: collectionId,
      });
    }
  }
  // auto create variants
  await createVariants(newProduct, cacheAvailableNumber, cacheProductOptions);
  // update media for product
  const listCreateMediaMap: MediaMap[] = cacheMedia.map((media: Media) => {
    return {
      mediaId: media.id,
      targetId: newProduct.id,
      targetType: "product",
    };
  });
  await mediaMapServices.createMediaMaps(listCreateMediaMap);
  // return product with full info
  const currentProduct = await productDaos.getProductById(newProduct.id);
  return productHelpers.formatProductResponse(currentProduct);
};

/**
 * createVariants tạo variant khi tạo product
 * @param newProduct product vừa tạo
 * @param cacheAvailableNumber số lượng của variant
 * @param createOptions
 * @returns null
 */
const createVariants = async (newProduct: Product, cacheAvailableNumber: number, createOptions: Option[]) => {
  const newVariant: Variant = {
    price: newProduct.price,
    comparePrice: newProduct.comparePrice,
    featureImageId: newProduct.featureImageId,
    availableNumber: cacheAvailableNumber,
    productId: newProduct.id,
  };
  if (!createOptions || !createOptions?.length) {
    await variantServices.createVariant(newVariant);
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
    } else if (createOptions.length === 2) {
      const cacheOptionValue: { [key: string]: OptionValue } = {};
      for (let i = 0; i < createOptions[0].optionValues?.length; i++) {
        const optionValue1 = createOptions[0].optionValues[i];
        const newOptionsValue1 = await optionValueServices.createOptionValue({
          value: optionValue1.value,
          optionId: newOptions[1].id,
        });
        for (let j = 0; j < createOptions[1].optionValues?.length; j++) {
          const optionValue2 = createOptions[1].optionValues[j];
          // check xem option position 2 này đã được tạo chưa
          let newOptionsValue2 = cacheOptionValue[optionValue2.value + "_2"];
          if (!newOptionsValue2) {
            // create option_value
            newOptionsValue2 = await optionValueServices.createOptionValue({
              value: optionValue2.value,
              optionId: newOptions[2].id,
            });
            cacheOptionValue[optionValue2.value + "_2"] = newOptionsValue2;
          }
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
    } else if (createOptions.length === 3) {
      const cacheOptionValue: { [key: string]: OptionValue } = {};
      for (let i = 0; i < createOptions[0].optionValues?.length; i++) {
        const optionValue1 = createOptions[0].optionValues[i];
        const newOptionsValue1 = await optionValueServices.createOptionValue({
          value: optionValue1.value,
          optionId: newOptions[1].id,
        });
        for (let j = 0; j < createOptions[1].optionValues?.length; j++) {
          const optionValue2 = createOptions[1].optionValues[j];
          // check xem option position 2 này đã được tạo chưa
          let newOptionsValue2 = cacheOptionValue[optionValue2.value + "_2"];
          if (!newOptionsValue2) {
            // create option_value
            newOptionsValue2 = await optionValueServices.createOptionValue({
              value: optionValue2.value,
              optionId: newOptions[2].id,
            });
            cacheOptionValue[optionValue2.value + "_2"] = newOptionsValue2;
          }
          for (let k = 0; k < createOptions[2].optionValues?.length; k++) {
            const optionValue3 = createOptions[2].optionValues[k];
            // check xem option position 3 này đã được tạo chưa
            let newOptionsValue3 = cacheOptionValue[optionValue3.value + "_3"];
            if (!newOptionsValue3) {
              // create option_value
              newOptionsValue3 = await optionValueServices.createOptionValue({
                value: optionValue3.value,
                optionId: newOptions[3].id,
              });
              cacheOptionValue[optionValue3.value + "_3"] = newOptionsValue3;
            }
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
};

/**
 * getProducts get products service
 * @param params.pagination {limit, offset}
 * @returns list products
 */
const getProducts = async (params: ProductSearchParams): Promise<{ products: ProductResponse[]; total: number }> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  const newParams = {
    ...params,
    pagination,
  };
  let result = await productDaos.getProducts(newParams);
  result.products = result.products.map((product: Product) => {
    return productHelpers.formatProductResponse(product);
  });
  return result;
};

/**
 * getProductById
 * @param id id cua product
 * @returns product
 */
const getProductById = async (id: number): Promise<ProductResponse> => {
  const findProduct = await productDaos.getProductById(id);
  if (!findProduct) {
    throw new CustomError(codes.NOT_FOUND, "Product not found!");
  }
  return productHelpers.formatProductResponse(findProduct);
};

/**
 * updateProduct: update product
 * @param id id can update
 * @param data data can update
 * @returns
 */
const updateProduct = async (id: number, data: Product): Promise<ProductResponse> => {
  const findProduct = await getProductById(id);
  delete data.id;
  if (data.featureImageId && data.media) {
    productHelpers.checkProductMedia(data.media, data.featureImageId);
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
        return !currentMedia.find((item) => item.id === media.id) && media.id !== data.featureImageId;
      })
      .map((item: Media) => {
        return {
          mediaId: item.id,
          targetType: "product",
          targetId: findProduct.id,
        };
      });
    // delete media
    const listDeleteMediaMap: MediaMap[] = deleteMedia.map((item: number) => {
      return {
        mediaId: item,
        targetType: "product",
        targetId: id,
      };
    });
    await mediaMapServices.deleteMediaMaps(listDeleteMediaMap);
    // update media
    await mediaMapServices.createMediaMaps(addMedia);
    delete data.media;
  }
  await productDaos.updateProduct(id, data);
  return await getProductById(id);
};

/**
 * deleteProduct
 * @param id id can delete
 * @returns
 */
const deleteProduct = async (id: number) => {
  const findProduct = await getProductById(id);
  productDaos.deleteProduct(id);
  return findProduct;
};

/**
 * countProducts đếm xem có bn product
 * @param params.url url của product
 * @param params.title title của product
 * @returns total product
 */
const countProducts = async (params: { url?: string; title?: string }): Promise<number> => {
  const count: number = await productDaos.countProducts(params);
  return count;
};

const productServices = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  countProducts,
};

export default productServices;
