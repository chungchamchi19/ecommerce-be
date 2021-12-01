import express from "express";
import dotenv from "dotenv";
import routes from "./routes";
import bodyParser from "body-parser";
import errorHandler from "./middlewares/errorHandler";
import authMiddleware from "./middlewares/auth";
import asyncMiddleware from "./middlewares/async";
import cors from "cors";
import authRoleMiddleware from "./middlewares/authRole";
import connectDB from "./database/connectDB";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import docOptions from "./configs/docs";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
connectDB();
const specs = swaggerJsdoc(docOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true, customSiteTitle: "Ecommerce Api Document" }),
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(asyncMiddleware(authMiddleware));
app.use(asyncMiddleware(authRoleMiddleware));

/* routes */
routes(app).then(() => {
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`⚡️[]: Server is running at http://localhost:${PORT}`);
  });
});
