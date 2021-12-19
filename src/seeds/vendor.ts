import faker from "faker";
import { Vendor } from "../entities/vendor";
import vendorServices from "../modules/vendor/services";

const vendorSeeding = async () => {
  for (let i = 0; i < 15; i++) {
    const vendor: Vendor = {
      name: faker.commerce.productAdjective(),
    };
    await vendorServices.createVendor(vendor);
  }
};

export default vendorSeeding;
