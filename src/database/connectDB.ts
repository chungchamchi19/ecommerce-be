/* eslint-disable no-console */
import { DataSource } from "typeorm";
import ormConfig from "./ormconfig";

export const appDataSource = new DataSource(ormConfig as any);

const connectDB = function (callback?: (...args: any[]) => void) {
  appDataSource
    .initialize()
    .then(() => {
      console.log("Connected to the database!");
      callback && callback();
    })
    .catch((e) => {
      console.log("Can not connect to the db: ", e);
    });
};

export default connectDB;
