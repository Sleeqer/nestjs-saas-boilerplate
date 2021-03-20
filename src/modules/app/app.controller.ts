import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

/**
 * Import local objects
 */
import { AppService } from './app.service';

/**
 * App Controller Class
 */
@ApiBearerAuth()
@Controller()
export class AppController {
  /**
   * Constructor of App Controller Class
   * @param {AppService} service App Service
   */
  constructor(private readonly service: AppService) {}

  /**
   * Retrieve Application Url
   * @returns {object} Application Url
   */
  @Get('healthz')
  @ApiOperation({ summary: 'Retrive application healthcheck.' })
  @ApiResponse({ status: 200, description: `Request Received.` })
  @ApiResponse({ status: 400, description: 'Request Failed.' })
  index(): object {
    return {
      _id: uuidv4(),
      url: this.service.index(),
      timestamp: new Date(),
    };
  }
}
