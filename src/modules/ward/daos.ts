import { appDataSource } from "./../../database/connectDB";
import { Ward } from "../../entities/ward";

const wardDaos = {
  async getList(districtId: string) {
    const wardRepo = appDataSource.getRepository(Ward);
    const wards = await wardRepo.find({
      where: {
        districtId: districtId,
      },
    });
    return wards;
  },
};

export default wardDaos;
