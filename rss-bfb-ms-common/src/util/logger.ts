import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf } = format;
import stream from 'stream';

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export const logger = createLogger({
  format: combine(label({ label: '' }), timestamp(), logFormat),
  transports: [
    new transports.File({
      level: 'info',
      filename: './log.log',
      handleExceptions: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
    }),
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
});

export const loggerWrite = {
  write: function (message: string) {
    logger.info(message);
  },
};

logger.stream = (options?: any) => new stream.Duplex(loggerWrite);
