import proviceDaos from './daos';

const provinceServices = {
  async getList() {
    return await proviceDaos.getList();
  },
};

export default provinceServices;
