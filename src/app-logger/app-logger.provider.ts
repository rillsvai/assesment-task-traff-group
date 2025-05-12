import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { IncomingMessage } from 'http';
import * as pino from 'pino';
import { Logger } from '@nestjs/common';
import { appLogsCollection } from 'src/common/constants/mongo.constants';
import { ignorePaths, staticFileRegex } from './app-logger.constants';
import { FastifyRequest } from 'fastify';

const bootstrapLogger = new Logger('AppLoggerFactory');

export const appLoggerFactory = async (config: ConfigService, connection: Connection) => {
  const db = connection.db!;

  const { capped, capSize, name } = appLogsCollection;
  const exists = (await db.listCollections({ name }).toArray()).length > 0;
  if (!exists) {
    bootstrapLogger.log(`Creating capped "${name}" collection...`);

    await db.createCollection(name, {
      capped: capped,
      size: capSize,
    });
  }

  bootstrapLogger.log(`Ensuring TTL index on "${name}.time"`);

  const appLogsTtl = config.get<number>('LOG_TTL');
  await db.collection(name).createIndex({ time: 1 }, { expireAfterSeconds: appLogsTtl });

  bootstrapLogger.log('Bootstrap complete, returning Pino config');

  return {
    pinoHttp: {
      level: config.get<string>('LOG_LEVEL'),
      autoLogging: {
        ignore: (req: IncomingMessage & FastifyRequest) => {
          const url = req.originalUrl.split('?')[0].toLowerCase();
          const method = req.method.toUpperCase();

          if (method === 'OPTIONS' || method === 'HEAD') return true;
          if (ignorePaths.some(p => url.startsWith(p))) return true;
          if (staticFileRegex.test(url)) return true;

          return false;
        },
      },
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            level: config.get<string>('LOG_LEVEL'),
            options: {
              colorize: config.get('NODE_ENV') !== 'production',
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
              hideObject: false,
            },
          },
          {
            target: 'pino-mongodb',
            level: 'info',
            options: {
              uri: config.get<string>('MONGO_URI'),
              collection: name,
              removeKeys: 'req,res,err.stack',
            },
          },
        ],
      },
      serializers: {
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
        err: pino.stdSerializers.err,
      },
    },
  };
};
