import connectDB from "../database/connectDB";
import collectionSedding from "./collection";
import productSeeding from "./product";
import vendorSeeding from "./vendor";

connectDB(async () => {
  await collectionSedding();
  await vendorSeeding();
  await productSeeding();
  process.exit(1);
});
