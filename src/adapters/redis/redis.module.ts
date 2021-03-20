import { Module } from '@nestjs/common';

/**
 * Import local objects
 */
import { RedisProviders } from './redis.providers';
import { RedisService } from './redis.service';

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
