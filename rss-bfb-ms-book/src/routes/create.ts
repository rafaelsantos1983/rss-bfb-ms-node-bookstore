import mongoose from 'mongoose';
import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  validateRequest,
  NotFoundError,
} from '@rss/rss-bfb-ms-common';

import { BookCreatedPublisher } from '../events/publishers/book-created-publisher';
import { natsWrapper } from '../nats-wrapper';

import { Book } from '../models/book';
import { Store } from '../models/store';

const router = express.Router();

router.post(
  '/api/books',
  [
    body('name').trim().not().isEmpty().withMessage('Name invalid.'),
    body('price').isFloat({ gt: 0 }).withMessage('Price invalid.'),
    body('storeId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Store invalido.'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, price, storeId } = req.body;

      const existingBook = await Book.findOne({ name });

      if (existingBook) {
        throw new BadRequestError('Livro já existe.');
      }

      const store = await Store.findById(storeId);
      if (!store) {
        throw new NotFoundError();
      }

      const book = Book.build({
        name,
        price,
        store: store,
      });
      await book.save();

      await new BookCreatedPublisher(natsWrapper.client).publish({
        id: book.id,
        price: book.price,
        store: {
          storeId: store.id,
        },
      });

      res.status(201).send(book);
    } catch (error) {
      next(error);
    }
  }
);

export { router as createRouter };
