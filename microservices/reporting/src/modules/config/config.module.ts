import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

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
