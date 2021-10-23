import express from 'express';
import asyncMiddleware from '../middlewares/async';
import tagControllers from '../modules/tag/controllers';

const router = express.Router();

router.post('/tags', asyncMiddleware(tagControllers.create));

export default router;
