import collectionServices from "../modules/collection/services";
import faker from "faker";
import mediaDaos from "../modules/media/daos";
import productServices from "../modules/product/services";
import { Media } from "../entities/media";
import { Option } from "../entities/option";
import vendorServices from "../modules/vendor/services";

const productSeeding = async () => {
  const listColRecord = await collectionServices.getCollections({ pagination: { limit: 25, offset: 0 } });
  const listCollection = listColRecord.collections.map((item) => item.id);
  const listMediaRecord = await mediaDaos.getMedias({ pagination: { limit: 25, offset: 0 } });
  const listMedia = listMediaRecord.map((item) => item.id);
  const listVendorRecord = await vendorServices.getVendors({ pagination: { limit: 25, offset: 0 } });
  const listVendor = listVendorRecord.vendors.map((item) => item.id);
  const options = [
    {
      title: "Color",
      values: [faker.commerce.color(), faker.commerce.color(), faker.commerce.color()],
    },
    {
      title: "Material",
      values: [faker.commerce.productMaterial(), faker.commerce.productMaterial(), faker.commerce.productMaterial()],
    },
  ];
  const formatOption: Option[] = options?.map((option: { title: string; values: string[] }) => {
    const optionValues = option.values.map((optionVal) => {
      return {
        value: optionVal,
      };
    });
    return {
      title: option.title,
      optionValues,
    };
  });
  for (let i = 0; i < 100; i++) {
    const collectionId = listCollection[Math.floor(Math.random() * listCollection.length)];
    const vendorId = listVendor[Math.floor(Math.random() * listVendor.length)];
    const listRandomMedia: number[] = [];
    for (let i = 0; i < 6; i++) {
      let randomMedia = listMedia[Math.floor(Math.random() * listMedia.length)];
      while (listRandomMedia.find((item) => item === randomMedia)) {
        randomMedia = listMedia[Math.floor(Math.random() * listMedia.length)];
      }
      listRandomMedia.push(randomMedia);
    }
    const featureImageId = listRandomMedia[0];
    const formatMedia: Media[] = listRandomMedia.map((item: number) => {
      return {
        id: item,
      };
    });
    const product = {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      status: "active",
      vendorId: vendorId,
      price: Number(faker.commerce.price()) * 1000,
      comparePrice: (Number(faker.commerce.price()) + 1000) * 1000,
      featureImageId: featureImageId,
      media: formatMedia,
      availableNumber: 80,
      collections: [collectionId],
      options: formatOption,
    };
    await productServices.createProduct(product);
  }
};

export default productSeeding;
