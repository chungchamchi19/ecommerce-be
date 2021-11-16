import { createConnection } from "typeorm";
import ormConfig from "./ormconfig";

const connectDB = function () {
  createConnection(ormConfig as any)
    .then(() => {
      console.log("Connected to the database!");
    })
    .catch((e) => {
      console.log("Can not connect to the db: ", e);
    });
};

export default connectDB;
