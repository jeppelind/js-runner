import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import {
  format, createLogger, transports, Logger as WinstonLogger,
} from 'winston';
import ini from 'ini';
import emitter from '../script-handler/eventEmitter';

const config = ini.parse(readFileSync('./jsrunner.ini', 'utf-8'));
if (!config.paths || !config.paths.log) {
  config.paths.log = './jsrunner.log';
}

export type LogItem = {
  id: string,
  msg: string,
  level: string,
  time: number,
  meta: Record<string, unknown>,
}

const updateLog = (level: string, msg: any, meta: Record<string, unknown>) => {
  const now = Date.now();
  const logItem: LogItem = {
    msg: msg.toString(),
    level,
    meta,
    id: randomUUID(),
    time: now,
  };
  emitter.emit('logUpdated', logItem);
};

export class Logger {
  #winston: WinstonLogger;

  constructor(meta?: Record<string, unknown>) {
    this.#winston = createLogger({
      level: 'info',
      format: format.combine(format.timestamp(), format.splat(), format.simple()),
      defaultMeta: meta || { script: 'main' },
      transports: [
        new transports.File({ filename: config.paths.log }),
      ],
    });
    if (process.env.NODE_ENV !== 'production') {
      this.#winston.add(new transports.Console());
    }
  }

  log(msg: any) {
    this.#winston.log('info', msg);
    updateLog('info', msg, this.#winston.defaultMeta);
  }

  warn(msg: any) {
    this.#winston.log('warn', msg);
    updateLog('warn', msg, this.#winston.defaultMeta);
  }

  error(msg: any) {
    this.#winston.log('error', msg);
    updateLog('error', msg, this.#winston.defaultMeta);
  }
}

const logger = new Logger();

export default logger;
