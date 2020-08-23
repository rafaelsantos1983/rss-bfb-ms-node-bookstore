import mongose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';

import { logger } from '@rss/rss-bfb-ms-common';

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.LOGGER_LEVEL) {
    throw new Error('LOGGER_LEVEL must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      logger.info('NATS conexão fechada!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    logger.info('MongoDB conectado.');

    app.locals.logger = logger;
  } catch (err) {
    logger.log('error', err);
  }
};

app.listen(3000, () => {
  logger.info('HTTP Server rodando na porta 3000');
});

start();
