import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { NotFoundError, validateRequest } from '@rss/rss-bfb-ms-common';

import { natsWrapper } from '../nats-wrapper';
import { BookUpdatedPublisher } from '../events/publishers/book-updated-publisher';

import { Book } from '../models/book';
import { Store } from '../models/store';

const router = express.Router();

router.put(
  '/api/books/:id',
  [
    body('name').trim().not().isEmpty().withMessage('Invalid Name'),
    body('price').isFloat({ gt: 0 }).withMessage('Invalid Price'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existingBook = await Book.findById(req.params.id).populate('store');

      if (!existingBook) {
        throw new NotFoundError();
      }

      existingBook.set({
        name: req.body.name,
        price: req.body.price,
      });

      await existingBook.save();

      const store = await Store.findById(existingBook.store.id);

      if (!store) {
        throw new NotFoundError();
      }

      await store.save();

      new BookUpdatedPublisher(natsWrapper.client).publish({
        price: existingBook.price,
        store: {
          storeId: store.id,
        },
      });

      res.send(existingBook);
    } catch (error) {
      next(error);
    }
  }
);

export { router as updateRouter };
