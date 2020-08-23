import express, { Request, Response } from 'express';
import { NotFoundError } from '@rss/rss-bfb-ms-common';

import { Store } from '../models/store';

const router = express.Router();

router.delete('/api/stores/:id', async (req: Request, res: Response) => {
  const store = await Store.findById(req.params.id);

  if (!store) {
    throw new NotFoundError();
  }

  await store.deleteOne();

  res.status(204).send(store);
});

export { router as deleteRouter };
