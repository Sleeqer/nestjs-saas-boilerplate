import { MongooseModule, MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AccessControlModule } from 'nest-access-control';
import * as WinstonMongoDB from 'winston-mongodb';
import { GraphQLModule } from '@nestjs/graphql';
import { RouterModule } from 'nest-router';
import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import * as winston from 'winston';
import { join } from 'path';

/**
 * Import local objects
 */
import { ConfigModule, ConfigService } from '../config';
import { HttpExceptionFilter } from '../common/filters';
import { OrganizationModule } from '../organization';
import { SharedModule } from '../../adapters/shared';
import { ConversationModule } from '../conversation';
import { ApplicationModule } from '../application';
import { AuthModule } from '../authorization';
import { routes, AppController } from './';
import { AppService } from './app.service';
import { WinstonModule } from '../winston';
import { ProfileModule } from '../profile';
import { MessageModule } from '../message';
import { EntityModule } from '../entity';
import { ReportModule } from '../report';
import { MemberModule } from '../member';
import { UserModule } from '../user';
import { roles } from './app.roles';

/**
 * Declare module
 */
@Module({
  imports: [
    RouterModule.forRoutes(routes),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ({
          uri: `${config.database()}`,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        } as MongooseModuleAsyncOptions),
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.env('dev')
          ? {
              level: 'info',
              format: winston.format.json(),
              defaultMeta: { service: 'default-service' },
              transports: [
                new winston.transports.Console({
                  format: winston.format.simple(),
                }),
                new WinstonMongoDB.MongoDB({
                  db: `${config.logger()}`,
                }),
              ],
            }
          : {
              level: 'info',
              format: winston.format.json(),
              defaultMeta: { service: 'user-service' },
              transports: [
                new winston.transports.File({
                  filename: 'logs/error.log',
                  level: 'error',
                }),
                new winston.transports.Console({
                  format: winston.format.simple(),
                }),
                new DailyRotateFile({
                  filename: 'logs/application-%DATE%.log',
                  datePattern: 'YYYY-MM-DD',
                  zippedArchive: true,
                  maxSize: '20m',
                  maxFiles: '14d',
                }),
                new WinstonMongoDB.MongoDB({
                  options: {
                    includeIds: true,
                  },
                  db: `${config.logger()}`,
                }),
              ],
            };
      },
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    AccessControlModule.forRoles(roles),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      debug: true,
      path: 'api/v1/graphql',
    }),
    ConfigModule,
    AuthModule,
    EntityModule,
    SharedModule,
    ApplicationModule,
    OrganizationModule,
    UserModule,
    ReportModule,
    ConversationModule,
    ProfileModule,
    MemberModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})

/**
 * Export module
 */
export class AppModule {}
