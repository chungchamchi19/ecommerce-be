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

const createProduct = async (product: Product) => {
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
  };
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
