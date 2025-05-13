import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

@Module({})
export class MongoModule {
  static forRoot(): DynamicModule {
    return {
      module: MongoModule,
      imports: [
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (cfg: ConfigService): MongooseModuleOptions => ({
            uri: cfg.get<string>('MONGO_URI'),
          }),
        }),
      ],
      exports: [MongooseModule],
    };
  }

  static forFeature(models: { name: string; schema: Schema }[]): DynamicModule {
    return {
      module: MongoModule,
      imports: [MongooseModule.forFeature(models)],
      exports: [MongooseModule],
    };
  }
}
