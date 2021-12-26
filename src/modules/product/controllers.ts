import { Product } from "../../entities/product";
import { Request, Response } from "express";
import productServices from "./services";
import CustomError from "../../errors/customError";
import codes from "../../errors/codes";
import { Option } from "../../entities/option";
import { Media } from "../../entities/media";

const createProduct = async (req: Request, res: Response) => {
  const { title, description, status, price, comparePrice, url, vendorId, featureImageId, media, availableNumber, options, collections, bestSelling } = req.body;
  if (!featureImageId) {
    throw new CustomError(codes.BAD_REQUEST, "Missing field featureImageId!");
  }
  if (!media) {
    throw new CustomError(codes.BAD_REQUEST, "Missing field media!");
  }
  if (options?.length > 3) {
    throw new CustomError(codes.BAD_REQUEST, "Max length of options is 3!");
  }
  const formatMedia: Media[] =
    media?.map((item: number) => {
      return {
        id: item,
      };
    }) || 0;
  const formatOption: Option[] =
    options?.map((option: { title: string; values: string[] }) => {
      const optionValues = option.values.map((optionVal) => {
        return {
          value: optionVal,
        };
      });
      return {
        title: option.title,
        optionValues,
      };
    }) || 0;
  const productData: Product = {
    title,
    description,
    status,
    price,
    comparePrice,
    url,
    vendorId,
    featureImageId,
    media: formatMedia,
    availableNumber: availableNumber || 0,
    options: formatOption,
    collections,
    bestSelling,
  };
  const newProduct = await productServices.createProduct(productData);
  res.status(200).json({
    status: "success",
    result: newProduct,
  });
};

const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productServices.getProductById(Number(id));
  res.status(200).json({
    status: "success",
    result: product,
  });
};

const getProducts = async (req: Request, res: Response) => {
  const { limit, offset, title, status, vendorId, collectionId, minPrice, maxPrice, sortPrice, createdAt, bestSelling } = req.query;
  if (sortPrice && sortPrice !== "DESC" && sortPrice !== "ASC") {
    throw new CustomError(codes.BAD_REQUEST, "sortPrice should be DESC or ASC");
  }
  if (createdAt && createdAt !== "DESC" && createdAt !== "ASC") {
    throw new CustomError(codes.BAD_REQUEST, "createdAt should be DESC or ASC");
  }
  const data = await productServices.getProducts({
    pagination: { limit: Number(limit), offset: Number(offset) },
    title: title as string,
    status: status as string,
    vendorId: Number(vendorId),
    minPrice: Number(minPrice),
    maxPrice: Number(maxPrice),
    sortPrice: sortPrice as "DESC" | "ASC",
    createdAt: createdAt as "DESC" | "ASC",
    collectionId: Number(collectionId),
    bestSelling: bestSelling === "true",
  });
  res.status(200).json({
    status: "success",
    result: data.products,
    total: data.total,
  });
};

const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  if (data.media && data.media.length) {
    data.media = data.media.map((item: number) => {
      return {
        id: item,
      };
    });
  }
  if (data.options) {
    data.options =
      data.options?.map((option: { title: string; values: string[] }) => {
        const optionValues = option.values.map((optionVal) => {
          return {
            value: optionVal,
          };
        });
        return {
          title: option.title,
          optionValues,
        };
      }) || [];
    if (data.options.length > 3) {
      throw new CustomError(codes.BAD_REQUEST, "Maximum of options length is 3!");
    }
  }
  const product = await productServices.updateProduct(Number(id), data);
  res.status(200).json({
    status: "success",
    result: product,
  });
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productServices.deleteProduct(Number(id));
  res.status(200).json({
    status: "success",
    result: product,
  });
};

const productControllers = {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
};

export default productControllers;
