import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

/**
 * App Controller Class
 */
@ApiBearerAuth()
@Controller()
export class AppController {
  /**
   * Constructor of App Controller Class
   * @param {AppService} service app service
   */
  constructor(private readonly service: AppService) {}

  /**
   * Returns the an environment variable from config file
   * @returns {string} the application environment url
   */
  @Get('healthz')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: 'Root Request Completed' })
  @ApiResponse({ status: 400, description: 'Root Request Failed' })
  root(): string {
    return this.service.root();
  }

  /**
   * Fetches request metadata
   * @param {Req} req the request body
   * @returns {Partial<Request>} the request user populated from the passport module
   */
  @Get('request/user')
  @UseGuards(AuthGuard('jwt'))
  @ApiExcludeEndpoint()
  @ApiResponse({ status: 200, description: 'User Metadata Request Completed' })
  @ApiResponse({ status: 400, description: 'User Metadata Request Failed' })
  getRequestUser(@Req() req): Partial<Request> {
    return req.user;
  }
}
