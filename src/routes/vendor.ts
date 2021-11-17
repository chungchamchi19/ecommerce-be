import express from "express";
import asyncMiddleware from "../middlewares/async";
import vendorControllers from "../modules/vendor/controllers";
import vendorServices from "../modules/vendor/services";
const router = express.Router();

router.post("/vendors", asyncMiddleware(vendorControllers.createVendor));
router.get("/vendors", asyncMiddleware(vendorControllers.getVendors));
router.get("/vendors/:id", asyncMiddleware(vendorControllers.getVendorById));
router.put("/vendors/:id", asyncMiddleware(vendorControllers.updateVendor));
router.delete("/vendors/:id", asyncMiddleware(vendorControllers.deleteVendor));

export default router;
