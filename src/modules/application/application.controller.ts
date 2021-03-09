import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Get,
  Patch,
  HttpCode,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

/**
 * Import local objects
 */
import {
  ApplicationCreatePayload,
  ApplicationReplacePayload,
  ApplicationUpdatePayload,
} from './payload';
import { ParseIdPipe } from '../common/pipes';
import { ApplicationLoadByIdPipe } from './pipe';
import { Application } from './application.entity';
import { ApplicationService } from './application.service';
import { FastifyRequestInterface } from '../common/interfaces';
import { Pagination, Query as QueryPagination } from '../entity/pagination';
import { AuthGuard } from '@nestjs/passport';

/**
 * Application Paginate Response Class
 */
export class ApplicationPaginateResponse extends Pagination<Application> {
  /**
   * Results field
   */
  @ApiProperty({ type: [Application] })
  results: Application[];
}

/**
 * Application Controller Class
 */
@ApiBearerAuth()
@ApiTags('applications')
@Controller('applications')
export class ApplicationController {
  /**
   * Constructor of Application Controller Class
   * @param {ApplicationService} service Application Service
   */
  constructor(protected readonly service: ApplicationService) {}

  /**
   * Paginate Application objects by parameters
   * @param {QueryPagination} parameters Pagination query parameters
   * @returns {Promise<Pagination<Application>>} Paginated Application objects
   */
  @Get('')
  @UseGuards(AuthGuard('application'), AuthGuard('jwt'))
  @ApiOperation({ summary: 'Paginate Application objects.' })
  @ApiResponse({
    status: 200,
    description: `Application List Request Received.`,
    type: ApplicationPaginateResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Application List Request Failed.',
  })
  async index(
    @Query() parameters: QueryPagination,
  ): Promise<Pagination<Application>> {
    return this.service.paginate(parameters);
  }

  /**
   * Retrieve Application by id
   * @param {number | string} id Application's id
   * @returns {Promise<Application>} Application object
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve Application By id.' })
  @ApiResponse({
    status: 200,
    description: 'Application Retrieve Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Application Retrieve Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Application Retrieve Request Failed (Not found).',
  })
  async get(
    @Param('id', ApplicationLoadByIdPipe)
    id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<Application> {
    return request.locals.entity;
  }

  /**
   * Replace Application by id
   * @param {number | string} id Application's id
   * @param {ApplicationReplacePayload} payload Application's payload
   * @returns {Promise<Application>} Application object
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Replace Application By id.',
    description: '**Inserts** Application If It does not exists By id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Application Replace Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Application Replace Request Failed.',
  })
  async replace(
    @Param('id', ParseIdPipe) id: number | string,
    @Body() payload: ApplicationReplacePayload,
  ): Promise<Application> {
    return await this.service.replace(id, payload);
  }

  /**
   * Update Application by id
   * @param {number | string} id Application's id
   * @param {ApplicationUpdatePayload} payload Application's payload
   * @returns {Promise<Application>} Application object
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update Application by id.' })
  @ApiResponse({
    status: 200,
    description: 'Application Update Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Application Update Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Application Update Request Failed (Not found).',
  })
  async update(
    @Param('id', ApplicationLoadByIdPipe) id: number | string,
    @Body() payload: ApplicationUpdatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Application> {
    return await this.service.save(request.locals.entity, payload);
  }

  /**
   * Delete Application by id
   * @param {number | string} id Application's id
   * @returns {Promise<DeleteResult>} Data of deleted result
   */
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Application By id.' })
  @ApiResponse({
    status: 204,
    description: 'Application Delete Request Received.',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Application Delete Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Application Delete Request Failed (Not found).',
  })
  async destroy(
    @Param('id', ApplicationLoadByIdPipe) id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<any> {
    await this.service.remove(request.locals.entity);
    return {};
  }

  /**
   * Create Application by payload
   * @param {ApplicationCreatePayload} payload Application's payload
   * @returns {Promise<Application>} Application object
   */
  @Post()
  @ApiOperation({ summary: 'Create Application.' })
  @ApiResponse({
    status: 201,
    description: 'Application Create Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Application Create Request Failed.',
  })
  async create(
    @Body() payload: ApplicationCreatePayload,
  ): Promise<Application> {
    return await this.service.create(payload);
  }
}
