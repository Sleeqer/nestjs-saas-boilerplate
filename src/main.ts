import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as headers from 'fastify-helmet';
import * as fastifyRateLimiter from 'fastify-rate-limit';
import { AppModule } from './modules/app/app.module';
import cors from 'fastify-cors';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * The endpoint for open api ui
 * @type {string}
 */
export const SWAGGER_API_ROOT: string = 'api/docs';

/**
 * The name given to the api
 * @type {string}
 */
export const SWAGGER_API_NAME: string = 'API';

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
  });

  core.register(cors);

  const application = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    core,
  );

  /**
   * Swagger's options
   */
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(application, options);
  SwaggerModule.setup(SWAGGER_API_ROOT, application, document);

  application.setGlobalPrefix('api');

  application.getHttpAdapter().getInstance().register(headers, {
    contentSecurityPolicy: false,
  });

  application.register(fastifyRateLimiter.default, {
    max: 100,
    timeWindow: '1 minute',
  });

  application.useGlobalPipes(new ValidationPipe());

  /**
   * Startup
   */
  await application.listen(9000, '0.0.0.0');
})();
