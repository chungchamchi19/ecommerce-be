import { appDataSource } from "./../../database/connectDB";
import { ShopInfor } from "../../entities/shopInfor";

const createOrUpdateShopInfo = async (data: ShopInfor) => {
  const shopInforRepository = appDataSource.getRepository(ShopInfor);
  const oldOne = await shopInforRepository.find();
  let shopInforData: any = {};
  if (oldOne.length > 0) {
    shopInforData = {
      ...oldOne[0],
      ...data,
    };
    return await shopInforRepository.findOne({ where: { id: oldOne[0].id } });
  }
  shopInforData = {
    ...data,
  };
  const shopInfor = shopInforRepository.create(shopInforData);
  return await shopInforRepository.save(shopInfor);
};

const getShopInfor = async () => {
  const shopInforRepository = appDataSource.getRepository(ShopInfor);
  const shopInfor = await shopInforRepository.createQueryBuilder("si").getMany();
  return shopInfor[0];
};

export default {
  createOrUpdateShopInfo,
  getShopInfor,
};
