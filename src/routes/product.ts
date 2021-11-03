import express from "express";
import ROLES from "../constants/roles";
import asyncMiddleware from "../middlewares/async";
import productControllers from "../modules/product/controllers";
import { validatePermissionProducts } from "../validations/products";

const router = express.Router();

router.post("/products", validatePermissionProducts(ROLES.ADMIN), asyncMiddleware(productControllers.createProduct));
router.get("/products", asyncMiddleware(productControllers.getProducts));
router.get("/products/:id", asyncMiddleware(productControllers.getProductById));
router.put("/products/:id", validatePermissionProducts(ROLES.ADMIN), asyncMiddleware(productControllers.updateProduct));
router.delete(
  "/products/:id",
  validatePermissionProducts(ROLES.ADMIN),
  asyncMiddleware(productControllers.deleteProduct),
);

export default router;
