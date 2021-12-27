import { MediaMap } from "../../entities/mediaMap";
import { Product } from "../../entities/product";
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
import optionValueVariantDaos from "../optionValueVariant/daos";

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
    limit: params?.pagination?.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params?.pagination?.offset || 0,
  };
  const newParams = {
    ...params,
    pagination,
  };
  let result = await productDaos.getProducts(newParams);
  const formatProducts = result.products.map((product: Product) => {
    return productHelpers.formatProductResponse(product, { disableOptions: true, disableVariants: true });
  });
  return {
    products: formatProducts,
    total: result.total,
  };
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
  const findProduct = await productDaos.getProductById(id);
  delete data.id;
  // init update
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
    const formatProduct = productHelpers.formatProductResponse(findProduct);
    const currentMedia = formatProduct.media;
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
  if (data.options) {
    await updateVariantByOptions({ variants: findProduct.variants, options: findProduct.options, productId: findProduct.id }, data.options);
    delete data.options;
  }
  if (data.collections) {
    await updateCollectionsByProduct(data.collections, findProduct);
    delete data.collections;
  }
  if (JSON.stringify(data) !== "{}") {
    await productDaos.updateProduct(id, data);
  }
  return await getProductById(id);
};

/**
 * updateCollectionsByProduct update product collection
 * @param collections collections cần update
 * @param product product cần update
 */
const updateCollectionsByProduct = async (collections: number[], product: Product) => {
  const updated = [];
  for (let i = 0; i < collections.length; i++) {
    const collectionId = collections[i];
    if (product.productCollections.length > i) {
      const oldPC = product.productCollections[i];
      if (oldPC.collectionId !== collectionId) {
        await productCollectionServices.updateProductCollection(oldPC.id, { collectionId: collectionId });
      }
      updated.push(oldPC.id);
    } else {
      await productCollectionServices.createProductCollection({ collectionId: collectionId, productId: product.id });
    }
  }
  for (let i = 0; i < product.productCollections.length; i++) {
    const oldPC = product.productCollections[i];
    if (!updated.find((id) => id === oldPC.id)) {
      await productCollectionServices.deleteProductCollection(oldPC.id);
    }
  }
};

/**
 * updateVariantByOptions xử lý thêm, sửa, xóa variant theo options mới
 * @param oldData data cũ
 * @param newOptions options mới
 */
const updateVariantByOptions = async (oldData: { variants: Variant[]; options: Option[]; productId: number }, newOptions: Option[]) => {
  // update option trước
  const oldOptions = oldData.options;
  const updatedOptions = [];
  // lưu những option value được thê vào option hiện có để thực hiện create variant
  const newOptionValsInOption: { [key: string]: OptionValue[] } = {
    1: [],
    2: [],
    3: [],
  };
  for (let i = 0; i < newOptions.length; i++) {
    const newOption = newOptions[i];
    if (oldOptions.length > i) {
      const oldOption = oldOptions[i];
      if (oldOption.title !== newOption.title) {
        await optionServices.updateOption(oldOption.id, { title: newOption.title });
      }
      updatedOptions.push(oldOption.id);
      const newOptionVals = await createOrUpdateOptionValue(oldOption.optionValues, newOption.optionValues, oldOption.id);
      newOptionValsInOption[i + 1] = newOptionVals;
    } else {
      // không có thì tạo mới
      const createOption = await optionServices.createOption({ title: newOption.title, productId: oldData.productId, position: i + 1 });
      const newOptionVals = await createOrUpdateOptionValue([], newOption.optionValues, createOption.id);
      // nếu có thêm option thì tạo và cập nhật variant
      const updatedProduct = await productDaos.getProductById(oldData.productId);
      for (let varIdx = 0; varIdx < updatedProduct.variants.length; varIdx++) {
        const oldVariant = updatedProduct.variants[varIdx];
        for (let opIdx = 0; opIdx < newOptionVals.length; opIdx++) {
          const optionVal = newOptionVals[opIdx];
          if (opIdx === 0) {
            // cập nhật với option value đầu tiên
            await optionValueVariantServices.createOptionValueVariant({ variantId: oldVariant.id, optionValueId: optionVal.id });
          } else {
            // tạo variant mới với các option value tiếp theo
            const newVariant: Variant = {
              price: oldVariant.price,
              comparePrice: oldVariant.comparePrice,
              featureImageId: oldVariant.featureImageId,
              availableNumber: 0,
              productId: oldVariant.productId,
            };
            const createVariant = await variantServices.createVariant(newVariant);
            for (let ovvIdx = 0; ovvIdx < oldVariant.optionValueVariants.length; ovvIdx++) {
              const ovv = oldVariant.optionValueVariants[ovvIdx];
              await optionValueVariantServices.createOptionValueVariant({ variantId: createVariant.id, optionValueId: ovv.optionValue.id });
            }
            await optionValueVariantServices.createOptionValueVariant({ variantId: createVariant.id, optionValueId: optionVal.id });
          }
        }
      }
    }
  }
  // xóa đi những option thừa
  const deleteOptions = [];
  for (let i = 0; i < oldOptions.length; i++) {
    const oldOption = oldOptions[i];
    if (!updatedOptions.find((id) => id === oldOption.id)) {
      deleteOptions.push(oldOption.id);
    }
  }
  deleteOptions.length && (await optionServices.deleteOptions(deleteOptions));

  // update variants
  const updatedProduct = await productDaos.getProductById(oldData.productId);
  // xóa đi những variant thừa
  const deleteVariants = updatedProduct.variants
    .filter((variant) => {
      return variant.optionValueVariants?.length < newOptions.length;
    })
    .map((variant) => variant.id);
  deleteVariants.length && (await variantServices.deleteVariantByIds(deleteVariants));
  // nếu newOptions bị xóa đi option so với oldOptions
  const formatUpdatedProduct = productHelpers.formatProductResponse(updatedProduct);
  if (oldOptions.length > newOptions.length) {
    const checkVariantTitles: string[] = [];
    for (let i = 0; i < formatUpdatedProduct.variants.length; i++) {
      const variant = formatUpdatedProduct.variants[i];
      if (!checkVariantTitles.includes(variant.publicTitle)) {
        const deleteVariantIds = formatUpdatedProduct.variants
          .filter((item) => {
            return item.publicTitle === variant.publicTitle && item.id !== variant.id;
          })
          .map((item) => item.id);
        deleteVariantIds.length && (await variantServices.deleteVariantByIds(deleteVariantIds));
        checkVariantTitles.push(variant.publicTitle);
      }
    }
  }
  // những option value được thê vào option hiện có thực hiện create variant
  if (newOptionValsInOption["1"].length) {
    const currentOptions: Option[] = [
      {
        optionValues: newOptionValsInOption["1"],
      },
    ];
    if (updatedProduct.options.length >= 2) {
      currentOptions.push({
        optionValues: updatedProduct.options[1].optionValues,
      });
    }
    if (updatedProduct.options.length === 3) {
      currentOptions.push({
        optionValues: updatedProduct.options[2].optionValues,
      });
    }
    await createVariantsFromExistOptions(currentOptions, updatedProduct);
  }
  if (newOptionValsInOption["2"].length) {
    const currentOptions: Option[] = [];
    currentOptions.push({
      optionValues: updatedProduct.options[0].optionValues,
    });
    currentOptions.push({
      optionValues: newOptionValsInOption["2"],
    });
    if (updatedProduct.options.length === 3) {
      currentOptions.push({
        optionValues: updatedProduct.options[2].optionValues,
      });
    }
    await createVariantsFromExistOptions(currentOptions, updatedProduct);
  }
  if (newOptionValsInOption["3"].length) {
    const currentOptions: Option[] = [];
    currentOptions.push({
      optionValues: updatedProduct.options[0].optionValues,
    });
    currentOptions.push({
      optionValues: updatedProduct.options[1].optionValues,
    });
    currentOptions.push({
      optionValues: newOptionValsInOption["3"],
    });
    await createVariantsFromExistOptions(currentOptions, updatedProduct);
  }
};

/**
 * createVariantsFromExistOptions tạo variant từ options có sẵn trong db
 * @param options options
 * @param product product cần tạo variant
 */
const createVariantsFromExistOptions = async (options: Option[], product: Product) => {
  const newVariant: Variant = {
    price: product.price,
    comparePrice: product.comparePrice,
    featureImageId: product.featureImageId,
    availableNumber: 0,
    productId: product.id,
  };
  for (let ov1Idx = 0; ov1Idx < options[0].optionValues.length; ov1Idx++) {
    const ov1 = options[0].optionValues[ov1Idx];
    if (options.length >= 2) {
      for (let ov2Idx = 0; ov2Idx < options[1].optionValues.length; ov2Idx++) {
        const ov2 = options[1].optionValues[ov2Idx];
        if (options.length === 3) {
          for (let ov3Idx = 0; ov3Idx < options[2].optionValues.length; ov3Idx++) {
            const ov3 = options[2].optionValues[ov3Idx];
            const currentVariant = await variantServices.createVariant(newVariant);
            await optionValueVariantDaos.createOptionValueVariant({ optionValueId: ov1.id, variantId: currentVariant.id });
            await optionValueVariantDaos.createOptionValueVariant({ optionValueId: ov2.id, variantId: currentVariant.id });
            await optionValueVariantDaos.createOptionValueVariant({ optionValueId: ov3.id, variantId: currentVariant.id });
          }
        } else {
          const currentVariant = await variantServices.createVariant(newVariant);
          await optionValueVariantDaos.createOptionValueVariant({ optionValueId: ov1.id, variantId: currentVariant.id });
          await optionValueVariantDaos.createOptionValueVariant({ optionValueId: ov2.id, variantId: currentVariant.id });
        }
      }
    } else {
      const currentVariant = await variantServices.createVariant(newVariant);
      await optionValueVariantDaos.createOptionValueVariant({ optionValueId: ov1.id, variantId: currentVariant.id });
    }
  }
};

/**
 * createOrUpdateOptionValue thêm hoặc sửa option value theo options
 * @param oldOptionValues optionValues cũ
 * @param newOptionsValues optionValues mới
 * @param optionId option id
 * @returns những option values mới được tạo
 */
const createOrUpdateOptionValue = async (oldOptionValues: OptionValue[], newOptionsValues: OptionValue[], optionId: number) => {
  const newOptionValues = [];
  if (oldOptionValues?.length) {
    // trường hợp cần update
    const updated = [];
    // cập nhật option_value cũ
    for (let i = 0; i < newOptionsValues.length; i++) {
      const newOptionVal = newOptionsValues[i];
      if (oldOptionValues.length > i) {
        const oldOptionVal = oldOptionValues[i];
        if (oldOptionVal.value !== newOptionVal.value) {
          await optionValueServices.updateOptionValue(oldOptionVal.id, { value: newOptionVal.value });
        }
        updated.push(oldOptionVal.id);
      } else {
        const newOptionValue = await optionValueServices.createOptionValue({
          value: newOptionVal.value,
          optionId: optionId,
        });
        newOptionValues.push(newOptionValue);
      }
    }
    // xóa những option_value còn thừa
    const deleteIds = [];
    for (let i = 0; i < oldOptionValues.length; i++) {
      const oldOptionVal = oldOptionValues[i];
      if (!updated.find((id) => id === oldOptionVal.id)) {
        deleteIds.push(oldOptionVal.id);
      }
    }
    deleteIds.length && (await optionValueServices.deleteOptionValues(deleteIds));
    return newOptionValues;
  }
  // trường hợp cần tạo
  for (let i = 0; i < newOptionsValues.length; i++) {
    const newOption = newOptionsValues[i];
    const newOptionValue = await optionValueServices.createOptionValue({
      value: newOption.value,
      optionId: optionId,
    });
    newOptionValues.push(newOptionValue);
  }
  return newOptionValues;
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
