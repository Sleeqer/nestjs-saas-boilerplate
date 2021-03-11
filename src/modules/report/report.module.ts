import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Import local objects
 */
import { RedisPropagatorModule } from '../../adapters/redis/propagator/redis.propagator.module';
import { RabbitMQModule } from '../../adapters/rabbitmq/rabbitmq.module';
import { ReportListener } from './listener/report.listener';
import { ReportHandler } from './handler/report.handler';
import { ReportController } from './report.controller';
import { Report, ReportSchema } from './report.entity';
import { ConversationModule } from '../conversation';
import { ReportResolver } from './report.resolver';
import { ReportService } from './report.service';
import { UserModule } from '../user';

/**
 * Define module
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    RabbitMQModule,
    RedisPropagatorModule,
    ConversationModule,
    UserModule,
  ],
  providers: [ReportService, ReportListener, ReportResolver, ReportHandler],
  exports: [ReportService],
  controllers: [ReportController],
})

/**
 * Export module
 */
export class ReportModule {}
