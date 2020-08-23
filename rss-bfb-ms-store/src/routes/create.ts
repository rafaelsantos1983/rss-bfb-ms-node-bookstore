import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@rss/rss-bfb-ms-common';

import { Store } from '../models/store';

import { StoreCreatedPublisher } from '../events/publishers/store-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/stores',
  [body('name').trim().not().isEmpty().withMessage('Invalid Name')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name } = req.body;

    const existingStore = await Store.findOne({
      name: name,
    });

    if (existingStore) {
      throw new BadRequestError('Store in use');
    }

    const store = Store.build({
      name: name,
      collection_price: 0,
    });
    await store.save();

    res.status(201).send(store);

    await new StoreCreatedPublisher(natsWrapper.client).publish({
      id: store.id,
      version: store.version,
      name: store.name,
    });
  }
);

export { router as createRouter };
