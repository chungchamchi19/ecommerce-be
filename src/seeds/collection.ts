import faker from "faker";
import { Collection } from "../entities/collection";
import collectionServices from "../modules/collection/services";
import mediaDaos from "../modules/media/daos";

const collectionSedding = async () => {
  const listMediaRecord = await mediaDaos.getMedias({ pagination: { limit: 25, offset: 0 } });
  const listMedia = listMediaRecord.map((item) => item.id);
  for (let i = 0; i < 15; i++) {
    const mediaId = listMedia[Math.floor(Math.random() * listMedia.length)];
    const collection: Collection = {
      title: faker.commerce.department(),
      description: faker.commerce.productDescription(),
      thumbnailId: mediaId,
    };
    await collectionServices.createCollection(collection);
  }
};

export default collectionSedding;
