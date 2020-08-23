import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { NotFoundError, validateRequest } from '@rss/rss-bfb-ms-common';

import { Store } from '../models/store';

const router = express.Router();

router.put(
  '/api/store/:id',
  [
    body('observation')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Observation is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name } = req.body;

    const store = await Store.findById(req.params.id);

    if (!store) {
      throw new NotFoundError();
    }

    store.set({
      name: name,
    });
    await store.save();

    res.send(store);
  }
);

export { router as updateRouter };
