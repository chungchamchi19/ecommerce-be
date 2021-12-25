import { getRepository } from 'typeorm';
import { Province } from '../../entities/province';

const proviceDaos = {
  async getList() {
    const provinceRepo = getRepository(Province);
    const provinces = await provinceRepo.find();
    return provinces;
  },
};

export default proviceDaos;
