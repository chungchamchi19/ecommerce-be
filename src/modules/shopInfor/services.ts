import { ShopInfor } from "../../entities/shopInfor";
import { Pagination } from "../../types/type.pagination";
import { sendEmail } from "../../utils/sendEmail";
import shopInforDao from "./daos";

const createOrUpdateShopInfor = async (shopInfor: ShopInfor) => {
  const newShopInfor = await shopInforDao.createOrUpdateShopInfo(shopInfor);
  return newShopInfor;
};

const getShopInfor = async () => {
  return await shopInforDao.getShopInfor();
};

export default { createOrUpdateShopInfor, getShopInfor };
