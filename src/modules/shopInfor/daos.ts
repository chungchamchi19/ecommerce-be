import { getRepository } from "typeorm";
import configs from "../../configs";
import { ShopInfor } from "../../entities/shopInfor";
import { Pagination } from "../../types/type.pagination";

const createOrUpdateShopInfo = async (data: ShopInfor) => {
  const shopInforRepository = getRepository(ShopInfor);
  const oldOne = await shopInforRepository.find();
  let shopInforData: any = {};
  if (oldOne.length > 0) {
    shopInforData = {
      ...oldOne[0],
      ...data,
    };
    const newShopInfor = await shopInforRepository.save(shopInforData);
    return await shopInforRepository.findOne(oldOne[0].id);
  }
  shopInforData = {
    ...data,
  };
  const shopInfor = shopInforRepository.create(shopInforData);
  return await shopInforRepository.save(shopInfor);
};

const getShopInfor = async () => {
  const shopInforRepository = getRepository(ShopInfor);
  const shopInfor = await shopInforRepository.createQueryBuilder("si").getMany();
  return shopInfor[0];
};

export default {
  createOrUpdateShopInfo,
  getShopInfor,
};
