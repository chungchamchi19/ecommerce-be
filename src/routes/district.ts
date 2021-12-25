import express from 'express';
import asyncMiddleware from '../middlewares/async';
import districtControllers from '../modules/district/controllers';

const router = express.Router();

router.get('/districts', asyncMiddleware(districtControllers.getList));

export default router;
