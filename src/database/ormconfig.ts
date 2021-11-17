import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

export default {
  name: "default",
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname, "..", "entities", "**", "*.*"), path.join(__dirname, "..", "entities", "*.*")],
  migrations: [path.join(__dirname, "..", "migrations", "*.*")],
  cli: {
    entitiesDir: "src/entities",
    migrationsDir: "src/migrations",
  },
};
