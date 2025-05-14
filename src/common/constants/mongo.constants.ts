import { MongoCollectionOptions } from '../interfaces/mongo.interface';

export const appLogsCollection: MongoCollectionOptions = {
  name: 'appLogs',
  capSize: 100 * 1024 * 1024, // MB
  capped: true,
};
