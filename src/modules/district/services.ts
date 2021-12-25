import dicstrictDaos from "./daos";

const districtServices = {
  async getList(proviceId: string) {
    return await dicstrictDaos.getList(proviceId);
  },
};

export default districtServices;
