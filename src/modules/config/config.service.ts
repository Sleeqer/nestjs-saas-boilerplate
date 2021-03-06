import { parse } from 'dotenv';
import * as joi from '@hapi/joi';
import * as fs from 'fs';

/**
 * Key-value mapping
 */
export interface EnvConfig {
  [key: string]: string;
}

/**
 * Config Service
 */
export class ConfigService {
  /**
   * Object that will contain the injected environment variables
   */
  private readonly envConfig: EnvConfig;

  /**
   * Constructor
   * @param {string} filePath
   */
  constructor(filePath: string = '.env') {
    const config = parse(fs.readFileSync(filePath));
    this.envConfig = ConfigService.validateInput(config);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   * @param {EnvConfig} envConfig the configuration object with variables from the configuration file
   * @returns {EnvConfig} a validated environment configuration object
   */
  private static validateInput(envConfig: EnvConfig): EnvConfig {
    /**
     * A schema to validate envConfig against
     */
    const envVarsSchema: joi.ObjectSchema = joi.object({
      // APPLICAITON
      APPLICATION_PORT: joi.number().allow('').default(8000),
      APPLICATION_ENV: joi.string().valid('dev', 'prod').required(),
      APPLICATION_URL: joi.string().uri({
        scheme: [/https?/],
      }),
      WEBTOKEN_SECRET_KEY: joi.string().required(),
      WEBTOKEN_EXPIRATION_TIME: joi.number().default(1800),
      // DATABASE
      DB_TYPE: joi.string().allow('').default('mongodb'),
      DB_USERNAME: joi.string().allow('').default(''),
      DB_PASSWORD: joi.string().allow('').default(''),
      DB_HOST: joi.string().allow('').default('localhost'),
      DB_PORT: joi.number().allow('').default('8889'),
      DB_DATABASE: joi.string().allow('').default('nest'),
      // RABBITMQ
      RABBITMQ_HOST: joi.string().allow('').default('127.0.0.1'),
      RABBITMQ_PORT: joi.number().allow('').default(15672),
      RABBITMQ_USERNAME: joi.string().allow('').default('guest'),
      RABBITMQ_PASSWORD: joi.string().allow('').default('guest'),
      RABBITMQ_VHOST: joi.string().allow('').default('/'),
      // REDIS
      REDIS_HOST: joi.string().allow('').default('127.0.0.1'),
      REDIS_PORT: joi.number().allow('').default(6379),
      REDIS_USERNAME: joi.string().allow('').default(''),
      REDIS_PASSWORD: joi.string().allow('').default(''),
      // WEBSOCKET
      WEBSOCKET_PING_INTERVAL: joi.number().allow('').default(3000),
      WEBSOCKET_PING_TIMEOUT: joi.number().allow('').default(10000),
      WEBSOCKET_PORT: joi.number().allow('').default(9000),
      WEBSOCKET_PATH: joi.string().allow('').default('/websockets'),
    });

    /**
     * Represents the status of validation check on the configuration file
     */
    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) throw new Error(`Config validation error: ${error.message}`);
    return validatedEnvConfig;
  }

  /**
   * Fetches the key from the configuration file
   * @param {string} key
   * @param {string} defaults Default to value
   * @returns {string} the associated value for a given key
   */
  get(key: string, defaults?: string): string {
    return this.envConfig[key] || defaults;
  }

  /**
   * Checks whether the application environment set in the configuration file matches the environment parameter
   * @param {string} env
   * @returns {boolean} Whether or not the environment variable matches the application environment
   */
  isEnv(env: string): boolean {
    return this.envConfig.APPLICATION_ENV === env;
  }
}
