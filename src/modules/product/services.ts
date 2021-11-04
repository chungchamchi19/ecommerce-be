import { Pagination } from "./../../types/type.pagination";
import { Product } from "./../../entities/product";
import { convertToSlug } from "../../utils/convertToSlug";
import productDaos from "./daos";
import configs from "../../configs";
import mediaServices from "../media/services";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import { Media } from "../../entities/media";

const createProduct = async (product: Product) => {
  if (product.featureImageId && product.media) {
    checkProductMedia(product.media, product.featureImageId);
  }
  for (let i = 0; i < product.media.length; i++) {
    const image = product.media[i]?.id;
    const checkMedia = await mediaServices.getMediaById(Number(image));
    if (checkMedia && checkMedia.targetId) {
      throw new CustomError(codes.BAD_REQUEST, "Media is belong to another product!");
    }
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
  // update media for product
  const listMedia = [];
  for (let i = 0; i < cacheMedia.length; i++) {
    const image = cacheMedia[i]?.id;
    const updatedMedia = await mediaServices.updateMedia(Number(image), {
      targetId: newProduct.id,
      targetType: "product",
    });
    listMedia.push(updatedMedia);
  }
  const featureImage = listMedia.find((media: Media) => media.id === newProduct.featureImageId);
  return {
    ...newProduct,
    media: listMedia,
    featureImage,
  };
};

const getProducts = async (params: { pagination: Pagination }): Promise<Product[]> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  let listProduct = await productDaos.getProducts({ pagination });
  listProduct = listProduct.map((product: Product) => {
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
  const media = formatMedia(findProduct.featureImage, findProduct.media);
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
  if (data.featureImageId) {
    mediaServices.updateMedia(data.featureImageId, {
      targetType: "product",
      targetId: findProduct.id,
    });
  }
  if (data.media && !data.featureImageId && !data.media.find((item) => item.id === findProduct.featureImageId)) {
    throw new CustomError(codes.BAD_REQUEST, "Feature image id should have in media list!");
  }
  if (data.media) {
    const currentMedia = findProduct.media;
    const deleteMedia = currentMedia.filter((media: Media) => {
      return !data.media.find((item) => item.id === media.id);
    });
    const addMedia = data.media.filter((media: Media) => {
      return !currentMedia.find((item) => item.id === media.id);
    });
    // delete media
    for (let i = 0; i < deleteMedia.length; i++) {
      const deteteItem = deleteMedia[i];
      mediaServices.updateMedia(
        deteteItem.id,
        { targetId: null, targetType: null },
        { targetId: findProduct.id, targetType: "product" },
      );
    }
    // update media
    for (let i = 0; i < addMedia.length; i++) {
      const addItem = addMedia[i];
      mediaServices.updateMedia(addItem.id, { targetId: id, targetType: "product" });
    }
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
