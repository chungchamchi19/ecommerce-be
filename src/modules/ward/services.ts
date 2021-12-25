import wardDaos from "./daos";

const districtServices = {
  async getList(districtId: string) {
    return await wardDaos.getList(districtId);
  },
};

export default districtServices;
