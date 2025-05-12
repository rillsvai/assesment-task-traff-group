// src/logs/app-logs.seeder.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { appLogsCollectionName } from '../../../common/constants/mongo.constants';

@Injectable()
export class AppLogsSeeder implements OnModuleInit {
  private readonly ttlSeconds = 60 * 60 * 24 * 30; // 30 days

  constructor(
    private readonly logger: PinoLogger,
    @InjectConnection() private readonly connection: Connection,
  ) {
    this.logger.setContext(AppLogsSeeder.name);
  }

  async onModuleInit() {
    const db = this.connection.db;
    const collection = db!.collection(appLogsCollectionName);

    const collectionHasBeenCreated =
      (await db!.listCollections({ name: appLogsCollectionName }).toArray()).length > 0;

    if (!collectionHasBeenCreated) {
      this.logger.warn(`Collection "${appLogsCollectionName}" has not been created yet`);
    }

    this.logger.info({ field: 'time', expireAfterSeconds: this.ttlSeconds }, `Ensuring TTL index`);
    await collection.createIndex({ time: 1 }, { expireAfterSeconds: this.ttlSeconds });

    this.logger.info(`TTL index ensured on "${appLogsCollectionName}.time"`);
  }
}
