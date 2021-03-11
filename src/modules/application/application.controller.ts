import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiProperty,
  ApiExcludeEndpoint,
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
  UseInterceptors,
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
import { Loader } from './pipe';
import {
  Pagination,
  Query as QueryPagination,
} from '../common/entity/pagination';
import { ParseIdPipe } from '../common/pipes';
import { ApplicationService } from './application.service';
import { FastifyRequestInterface } from '../common/interfaces';
import { Application, ApplicationDocument } from './application.entity';
import { BaseEntityController } from '../common/entity/controller/entity.controller';
import { OrganizationInterceptor } from '../organization/interceptor/organization.interceptor';

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
@UseInterceptors(OrganizationInterceptor)
@ApiBearerAuth()
@ApiTags('applications')
@Controller('/')
export class ApplicationController extends BaseEntityController<
  Application,
  ApplicationDocument
> {
  /**
   * Constructor of Application Controller Class
   * @param {ApplicationService} service Application Service
   */
  constructor(protected readonly service: ApplicationService) {
    super(service);
  }

  /**
   * Paginate Application objects by parameters
   * @param {QueryPagination} parameters Pagination query parameters
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Pagination<Application>>} Paginated Application objects
   */
  @Get('')
  @UseGuards(AuthGuard('jwt'))
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
    @Req() request: FastifyRequestInterface,
  ): Promise<Pagination<Application>> {
    const { organization } = request.locals;

    /**
     * Filtering by organization
     */
    parameters.filter = { organization: organization._id };

    return this.service.paginate(parameters);
  }

  /**
   * Retrieve Application by id
   * @param {number | string} id Application's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Application>} Application's object
   */
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Retrieve Application By id.' })
  @ApiResponse({
    status: 200,
    description: 'Application Retrieve Request Received.',
    type: Application,
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
    @Param('id', Loader)
    id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<Application> {
    return request.locals.application;
  }

  /**
   * Replace Application by id
   * @param {number | string} id Application's id
   * @param {ApplicationReplacePayload} payload Application's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Application>} Application's object
   */
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Replace Application By id.',
    description: '**Inserts** Application If It does not exists By id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Application Replace Request Received.',
    type: Application,
  })
  @ApiResponse({
    status: 400,
    description: 'Application Replace Request Failed.',
  })
  async replace(
    @Param('id', ParseIdPipe) id: number | string,
    @Body() payload: ApplicationReplacePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Application> {
    return await this.service.replace(id, payload);
  }

  /**
   * Update Application by id
   * @param {number | string} id Application's id
   * @param {ApplicationUpdatePayload} payload Application's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Application>} Application's object
   */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update Application by id.' })
  @ApiResponse({
    status: 200,
    description: 'Application Update Request Received.',
    type: Application,
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
    @Param('id', Loader) id: number | string,
    @Body() payload: ApplicationUpdatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Application> {
    return await this.service.update(request.locals.application, payload);
  }

  /**
   * Delete Application by id
   * @param {number | string} id Application's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<object>} Empty object
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
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
    @Param('id', Loader) id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<object> {
    await this.service.destroy(request.locals.application._id);
    return {};
  }

  /**
   * Create Application by payload
   * @param {number | string} organization Organization's id
   * @param {ApplicationCreatePayload} payload Application's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Application>} Application object
   */
  @Post('')
  @UseGuards(AuthGuard('jwt'))
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
    @Req() request: FastifyRequestInterface,
  ): Promise<Application> {
    const { organization } = request.locals;
    let application = await this.service.create(payload);

    /**
     * Attach organization to application
     */
    application.organization = organization;
    application = await application.save();

    return application;
  }
}
