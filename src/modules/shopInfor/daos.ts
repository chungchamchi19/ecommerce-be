import { getRepository } from "typeorm";
import configs from "../../configs";
import { ShopInfor } from "../../entities/shopInfor";
import { Pagination } from "../../types/type.pagination";

const createOrUpdateShopInfo = async (data: ShopInfor) => {
  const shopInforRepository = getRepository(ShopInfor);
  const oldOne = await shopInforRepository.find();
  console.log(oldOne);
  console.log(data);
  let shopInforData: any = {};
  if (oldOne.length > 0) {
    shopInforData = {
      id: oldOne[0].id,
      facebook: data.facebook ? data.facebook : oldOne[0].facebook,
      zalo: data.zalo ? data.zalo : oldOne[0].zalo,
      bossName: data.bossName ? data.bossName : oldOne[0].bossName,
      email: data.email ? data.email : oldOne[0].email,
      phone: data.phone ? data.phone : oldOne[0].phone,
      bankAccountId: data.bankAccountId ? data.bankAccountId : oldOne[0].bankAccountId,
    };
    console.log(shopInforData);
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
  return shopInfor;
};

export default {
  createOrUpdateShopInfo,
  getShopInfor,
};
