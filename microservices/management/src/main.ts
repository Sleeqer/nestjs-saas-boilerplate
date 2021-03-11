import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app/app.module';
import { NestFactory } from '@nestjs/core';
import * as headers from 'fastify-helmet';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import cors from 'fastify-cors';

/**
 * Import local objects
 */
import { ConfigService } from './modules/config/config.service';
import { SocketStateAdapter } from './adapters/socket/state/socket.state.adapter';
import { SocketStateService } from './adapters/socket/state/socket.state.service';
import { RedisPropagatorService } from './adapters/redis/propagator/redis.propgator.service';
import { Transport } from '@nestjs/microservices';

/**
 * Current config
 * @type {ConfigService}
 */
const config: ConfigService = ConfigService.getInstance();

/**
 * The endpoint for open api ui
 * @type {string}
 */
export const SWAGGER_API_ROOT: string = 'api/v1/docs';

/**
 * The name given to the api
 * @type {string}
 */
export const SWAGGER_API_NAME: string = 'Management API';

/**
 * A short description for api
 * @type {string}
 */
export const SWAGGER_API_DESCRIPTION: string = 'API Description';

/**
 * Current version of the api
 * @type {string}
 */
export const SWAGGER_API_CURRENT_VERSION: string = '1.0';

(async () => {
  const core = new FastifyAdapter({
    logger: true,
    ignoreTrailingSlash: true,
    trustProxy: true,
  });

  core.getInstance().decorateRequest('locals', () => {});

  core.register(cors);

  const application = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    core,
  );

  /**
   * Microservice
   */

  application.connectMicroservice({
    transport: Transport.TCP,
  });

  /**
   * Usual config
   */
  application.setGlobalPrefix('api/v1');

  /**
   * Swagger's options
   */
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addBearerAuth()
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
      },
      'X-API-Key',
    )
    .build();

  const document = SwaggerModule.createDocument(application, options);
  SwaggerModule.setup(SWAGGER_API_ROOT, application, document);

  application.getHttpAdapter().getInstance().register(headers, {
    contentSecurityPolicy: false,
  });

  application.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  /**
   * Websockets
   */
  const socket = application.get(SocketStateService);
  const redis = application.get(RedisPropagatorService);
  application.useWebSocketAdapter(
    new SocketStateAdapter(application, socket, redis),
  );

  /**
   * Startup
   */
  const PORT = Number(config.get('APPLICATION_PORT', '9000'));
  await application.startAllMicroservicesAsync();
  await application.listen(PORT, '0.0.0.0');
})();
