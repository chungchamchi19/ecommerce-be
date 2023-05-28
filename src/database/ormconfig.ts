import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

export default {
  name: "default",
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  extra: {
    ssl: true,
  },
  synchronize: true,
  logging: true,
  entities: [path.join(__dirname, "..", "entities", "**", "*.*"), path.join(__dirname, "..", "entities", "*.*")],
  cli: {
    entitiesDir: "src/entities",
  },
};
