import express from "express";
import ROLES from "../constants/roles";
import asyncMiddleware from "../middlewares/async";
import variantControllers from "../modules/variant/controllers";
import { validatePermissionVariants } from "../validations/variant";

const router = express.Router();

router.post(
  "/admin/products/:productId/variants",
  validatePermissionVariants(ROLES.ADMIN),
  asyncMiddleware(variantControllers.create),
);
router.put(
  "/admin/products/:productId/variants/:id",
  validatePermissionVariants(ROLES.ADMIN),
  asyncMiddleware(variantControllers.update),
);

export default router;
