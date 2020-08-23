import express, { Request, Response, NextFunction } from 'express';

import { NotFoundError } from '@rss/rss-bfb-ms-common';

import { Book } from '../models/book';

const router = express.Router();

router.delete(
  '/api/books/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await Book.findById(req.params.id);

      if (!book) {
        throw new NotFoundError();
      }

      await book.deleteOne();

      res.status(204).send(book);
    } catch (error) {
      next(error);
    }
  }
);

export { router as deleteRouter };
