import { getRepository } from "typeorm";
import { Ward } from "../../entities/ward";

const wardDaos = {
  async getList(districtId: string) {
    const wardRepo = getRepository(Ward);
    const wards = await wardRepo.find({
      where: {
        districtId: districtId,
      },
    });
    return wards;
  },
};

export default wardDaos;
