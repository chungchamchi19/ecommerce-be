import { appDataSource } from "./../../database/connectDB";
import { District } from "../../entities/district";

const districtDaos = {
  async getList(provinceId: string) {
    const districtRepo = appDataSource.getRepository(District);
    const districts = await districtRepo.find({
      where: {
        provinceId: provinceId,
      },
    });
    return districts;
  },
};

export default districtDaos;
