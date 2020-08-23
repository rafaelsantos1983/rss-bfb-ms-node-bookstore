import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../errors/custom-error';
import { logger } from '../util/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  logger.info('error', err);
  res.status(400).send({
    errors: [
      {
        message: 'Erro na solicitação.',
      },
    ],
  });
};
