import jwt from 'express-jwt';
import express from 'express';
import morgan from 'morgan';
import { json } from 'body-parser';
import {
  errorHandler,
  NotFoundError,
  loggerWrite,
} from '@rss/rss-bfb-ms-common';

import { createRouter } from './routes/create';
import { showRouter } from './routes/show';
import { updateRouter } from './routes/update';
import { listRouter } from './routes/list';
import { deleteRouter } from './routes/delete';

const app = express();
app.set('trust proxy', true);
app.use(json());

if (process.env.NODE_ENV != 'development') {
  app.use(morgan(process.env.LOGGER_LEVEL as string, { stream: loggerWrite }));
}

// app.use(
//   jwt({
//     secret: process.env.JWT_SECRET as string,
//     algorithms: ['HS256'],
//   }).unless({
//     path: ['/api/stores/online'],
//   })
// );

app.use(onlineRouter);
app.use(createRouter);
app.use(showRouter);
app.use(updateRouter);
app.use(listRouter);
app.use(deleteRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
