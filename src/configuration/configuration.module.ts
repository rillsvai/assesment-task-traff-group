import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { Environment } from '../common/enums/environment.enum';
import { join } from 'path';
import { LogLevel } from '../common/enums/log-level.enum';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .required(),

  PORT: Joi.number().required(),

  MONGO_URI: Joi.string().uri().required(),

  LOG_LEVEL: Joi.string()
    .valid(...Object.values(LogLevel))
    .required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
      validationSchema,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigurationModule {}
