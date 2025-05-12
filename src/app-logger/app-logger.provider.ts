import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { IncomingMessage } from 'http';
import * as pino from 'pino';
import { ignorePaths, staticFileRegex } from './app-logger.constants';
import { appLogsCollectionName } from 'src/common/constants/mongo.constants';

export const appLoggerFactory = async (config: ConfigService, connection: Connection) => {
  const db = connection.db!;

  const exists = (await db.listCollections({ name: appLogsCollectionName }).toArray()).length > 0;
  if (!exists) {
    await db.createCollection(appLogsCollectionName, {
      capped: true,
      size: 100 * 1024 * 1024,
    });
  }

  await db
    .collection(appLogsCollectionName)
    .createIndex({ time: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

  return {
    pinoHttp: {
      level: config.get<string>('LOG_LEVEL'),
      autoLogging: {
        ignore: (req: IncomingMessage) => {
          const url = req.url ?? '';
          return staticFileRegex.test(url) || ignorePaths.some(p => url.startsWith(p));
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
              collection: appLogsCollectionName,
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
