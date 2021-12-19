import faker from "faker";
import { Collection } from "../entities/collection";
import collectionServices from "../modules/collection/services";

const collectionSedding = async () => {
  for (let i = 0; i < 15; i++) {
    const collection: Collection = {
      title: faker.commerce.department(),
      description: faker.commerce.productDescription(),
    };
    await collectionServices.createCollection(collection);
  }
};

export default collectionSedding;
