import { Request, Response } from "express";
import collectionServices from "./services";
import { Collection } from "../../entities/collection";

const createCollection = async (req: Request, res: Response) => {
  const { title, description, thumbnailId } = req.body;
  const collectionData: Collection = { title, description, thumbnailId };
  const newCollection = await collectionServices.createCollection(collectionData);
  res.status(200).json({
    status: "success",
    result: newCollection,
  });
};

const getCollectionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const collection = await collectionServices.getCollectionById(Number(id));
  res.status(200).json({
    status: "success",
    results: collection,
  });
};

const getCollections = async (req: Request, res: Response) => {
  const { limit, offset } = req.query;
  const collections = await collectionServices.getCollections({
    pagination: { limit: Number(limit), offset: Number(offset) },
  });
  res.status(200).json({
    status: "success",
    result: collections,
  });
};

const updateCollection = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const collection = await collectionServices.updateCollection(Number(id), data);
  res.status(200).json({
    status: "success",
    result: collection,
  });
};

const deleteCollection = async (req: Request, res: Response) => {
  const { id } = req.params;
  const collection = await collectionServices.deleteCollection(Number(id));
  res.status(200).json({
    status: "success",
    result: collection,
  });
};

// const deleteCollections = async (req: Request, res: Response) => {
//     const { ids } = req.params;
//     const collections = await collectionServices.deleteCollections(Array<number>(ids));
//     res.status(200).json({
//         status: "success",
//         result: collections,
//       });
// }

const collectionControllers = {
  createCollection,
  getCollectionById,
  getCollections,
  updateCollection,
  deleteCollection,
};

export default collectionControllers;
