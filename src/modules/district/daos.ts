import { getRepository } from "typeorm";
import { District } from "../../entities/district";

const districtDaos = {
  async getList(provinceId: string) {
    const districtRepo = getRepository(District);
    const districts = await districtRepo.find({
      where: {
        provinceId: provinceId,
      },
    });
    return districts;
  },
};

export default districtDaos;
