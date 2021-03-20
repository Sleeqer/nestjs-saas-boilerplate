import { Global, Module } from '@nestjs/common';

/**
 * Import local objects
 */
import { ConfigService } from './config.service';

/**
 * Declare module
 */
@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: ConfigService.getInstance(),
    },
  ],
  exports: [ConfigService],
})

/**
 * Export module
 */
export class ConfigModule {}
