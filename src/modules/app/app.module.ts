import { MongooseModule, MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AccessControlModule } from 'nest-access-control';
import * as DailyRotateFile from 'winston-daily-rotate-file';
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
import { routes } from './app.routes';
import { roles } from './app.roles';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../authorization/authorization.module';
import { AppController } from './app.controller';
import { OrganizationModule } from '../organization';
import { EntityModule } from '../entity/entity.module';
import { ReportModule } from '../report/report.module';
import { ConfigModule } from '../config/config.module';
import { HttpExceptionFilter } from '../common/filters';
import { ConfigService } from '../config/config.service';
import { WinstonModule } from '../winston/winston.module';
import { SharedModule } from '../../adapters/shared/shared.module';
import { ApplicationModule } from '../application/application.module';
import { ConversationModule } from '../conversation/conversation.module';
import { ProfileModule } from '../profile';
import { MemberModule } from '../member';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
      ({
        uri: `${config.get('DB_TYPE')}://${config.get('DB_USERNAME') && config.get('DB_PASSWORD')
          ? `${config.get('DB_USERNAME')}:${config.get('DB_PASSWORD')}@`
          : ``
          }${config.get('DB_HOST')}:${config.get('DB_PORT')}/${config.get(
            'DB_DATABASE',
          )}`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as MongooseModuleAsyncOptions),
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.isEnv('dev')
          ? {
            level: 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'user-service' },
            transports: [
              new winston.transports.Console({
                format: winston.format.simple(),
              }),
              new WinstonMongoDB.MongoDB({
                db: `mongodb://${config.get('LOGGER_DB_USERNAME') &&
                  config.get('LOGGER_DB_PASSWORD')
                  ? `${config.get('LOGGER_DB_USERNAME')}:${config.get(
                    'LOGGER_DB_PASSWORD',
                  )}@`
                  : ``
                  }${config.get('LOGGER_DB_HOST')}:${config.get(
                    'LOGGER_DB_PORT',
                  )}/${config.get('LOGGER_DB_DATABASE')}`,
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
                db: `mongodb://${config.get('LOGGER_DB_USERNAME') &&
                  config.get('LOGGER_DB_PASSWORD')
                  ? `${config.get('LOGGER_DB_USERNAME')}:${config.get(
                    'LOGGER_DB_PASSWORD',
                  )}@`
                  : ``
                  }${config.get('LOGGER_DB_HOST')}:${config.get(
                    'LOGGER_DB_PORT',
                  )}/${config.get('LOGGER_DB_DATABASE')}`,
              }),
            ],
          };
      },
    }),
    EventEmitterModule.forRoot({
      // Set this to `true` to use wildcards
      wildcard: false,
      // The delimiter used to segment namespaces
      delimiter: '.',
      // Set this to `true` if you want to emit the newListener event
      newListener: false,
      // Set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // The maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // Show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // Disable throwing uncaughtException if an error event is emitted and it has no listeners
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
    MemberModule
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
export class AppModule { }
