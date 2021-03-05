import * as winston from 'winston';
import * as rotateFile from 'winston-daily-rotate-file';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { AuthModule } from '../auth/auth.module';
import { ProfileModule } from '../profile/profile.module';
import { WinstonModule } from '../winston/winston.module';
import { EntityModule } from '../entity/entity.module';
import { AccessControlModule } from 'nest-access-control';
import { ParseIdPipeOptions } from '../common/pipes/parse.id.pipe';
import { roles } from './app.roles';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + './../**/**.entity{.ts,.js}'],
          synchronize: configService.isEnv('dev'),
          useNewUrlParser: true,
          keepConnectionAlive: true,
          logging: true,
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.isEnv('dev')
          ? {
              level: 'info',
              format: winston.format.json(),
              defaultMeta: { service: 'user-service' },
              transports: [
                new winston.transports.Console({
                  format: winston.format.simple(),
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
                new rotateFile({
                  filename: 'logs/application-%DATE%.log',
                  datePattern: 'YYYY-MM-DD',
                  zippedArchive: true,
                  maxSize: '20m',
                  maxFiles: '14d',
                }),
              ],
            };
      },
    }),
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
    AccessControlModule.forRoles(roles),
    ConfigModule,
    AuthModule,
    ProfileModule,
    EntityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
