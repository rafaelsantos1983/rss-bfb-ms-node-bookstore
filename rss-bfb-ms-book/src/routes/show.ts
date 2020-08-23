import express, { Request, Response, NextFunction } from 'express';

import { NotFoundError } from '@rss/rss-bfb-ms-common';

import { Book } from '../models/book';

const router = express.Router();

router.get(
  '/api/books/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await Book.findById(req.params.id).populate('store');

      if (!book) {
        throw new NotFoundError();
      }

      res.send(book);
    } catch (error) {
      next(error);
    }
  }
);

export { router as showRouter };
