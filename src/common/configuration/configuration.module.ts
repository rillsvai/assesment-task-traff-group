import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';
import { Environment } from '../enums/environment.enum';
import { LogLevel } from '../enums/log-level.enum';

const envFileName = process.env.NODE_ENV === Environment.Test ? '.env.test' : '.env';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .required(),

  PORT: Joi.number().required(),

  MONGO_URI: Joi.string().uri().required(),

  LOG_LEVEL: Joi.string()
    .valid(...Object.values(LogLevel))
    .required(),
  LOG_TTL: Joi.number().min(60).required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), envFileName),
      validationSchema,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigurationModule {}
