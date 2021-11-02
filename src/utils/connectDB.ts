import { createConnection } from "typeorm";

const connectDB = function () {
  createConnection()
    .then(() => {
      console.log("Connected to the database!");
    })
    .catch((e) => {
      console.log("Can not connect to the db: ", e);
    });
};

export default connectDB;
