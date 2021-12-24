import { Collection } from "../../entities/collection";
import collectionDaos from "./daos";
import codes from "../../errors/codes";
import CustomError from "../../errors/customError";
import { Pagination } from "../../types/type.pagination";
import configs from "../../configs";

const createCollection = async (collection: Collection): Promise<Collection> => {
  return await collectionDaos.createCollection(collection);
};

const getCollectionById = async (id: number): Promise<Collection> => {
  const collection = await collectionDaos.getCollectionById(id);
  if (!collection) {
    throw new CustomError(codes.NOT_FOUND, "Collection not found");
  } else {
    return collection;
  }
};

const updateCollection = async (id: number, collection: Collection): Promise<Collection> => {
  const findCollection = await collectionDaos.getCollectionById(id);
  if (!findCollection) {
    throw new CustomError(codes.NOT_FOUND, "Collection not found!");
  }
  delete collection.id;
  const newCollection = {
    ...findCollection,
    ...collection,
  };
  await collectionDaos.updateCollection(id, collection);
  return newCollection;
};

const getCollections = async (params: { pagination: Pagination }): Promise<Collection[]> => {
  const pagination = {
    limit: params.pagination.limit || configs.MAX_RECORDS_PER_REQ,
    offset: params.pagination.offset || 0,
  };
  return await collectionDaos.getCollections({ pagination });
};

const deleteCollection = async (id: number) => {
  const findCollection = await getCollectionById(id);
  if (!findCollection) {
    throw new CustomError(codes.NOT_FOUND, "Vendor not found");
  } else {
    await collectionDaos.deleteCollection(id);
    return findCollection;
  }
};

const deleteCollections = async (ids: number[]) => {
  const findCollections = [];
  for (var id of ids) {
    findCollections.push(await getCollectionById(id));
    await collectionDaos.deleteCollection(id);
  }
  return findCollections;
};

const collectionServices = {
  createCollection,
  updateCollection,
  getCollectionById,
  getCollections,
  deleteCollection,
  deleteCollections,
};

export default collectionServices;
