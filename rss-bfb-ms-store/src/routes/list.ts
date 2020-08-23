import express, { Request, Response } from 'express';
import { Store } from '../models/store';

const router = express.Router();

router.get('/api/stores', async (req: Request, res: Response) => {
  const stores = await Store.find({});

  res.send(stores);
});

export { router as listRouter };
