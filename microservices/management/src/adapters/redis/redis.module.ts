import { Module } from '@nestjs/common';

/**
 * Import local objects
 */
import { RedisService } from './redis.service';
import { RedisProviders } from './redis.providers';

/**
 * Define module
 */
@Module({
  providers: [...RedisProviders, RedisService],
  exports: [...RedisProviders, RedisService],
})

/**
 * Export module
 */
export class RedisModule {}
