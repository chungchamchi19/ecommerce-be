import express from "express";
import asyncMiddleware from "../middlewares/async";
import vendorControllers from "../modules/vendor/controllers";
import vendorServices from "../modules/vendor/services";
const router = express.Router();

router.post('/vendor', asyncMiddleware(vendorControllers.createVendor));
router.get('/vendor/:id', asyncMiddleware(vendorControllers.getVendorById));

export default router;