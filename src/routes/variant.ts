import express from "express";
import ROLES from "../constants/roles";
import asyncMiddleware from "../middlewares/async";
import variantControllers from "../modules/variant/controllers";
import { validatePermissionVariants } from "../validations/variant";

const router = express.Router();

router.post("/admin/products/:productId/variants", asyncMiddleware(variantControllers.create));
router.put("/admin/products/:productId/variants/:id", asyncMiddleware(variantControllers.update));
router.delete("/admin/variants/:id", asyncMiddleware(variantControllers.deleteVariantById));

export default router;
