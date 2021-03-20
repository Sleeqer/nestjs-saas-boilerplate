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
  UseGuards,
} from '@nestjs/common';

/**
 * Import local objects
 */
import { BaseEntityController } from '../common/entity/controller/entity.controller';
import { OrganizationGuards, ProfileGuards } from '../authorization/guards';
import { Application, ApplicationDocument } from './application.entity';
import { GuardsProperty } from '../authorization/guards/decorators';
import { FastifyRequestInterface } from '../common/interfaces';
import { ApplicationService } from './application.service';
import { ParseIdPipe } from '../common/pipes';
import {
  Pagination,
  Query as QueryPagination,
} from '../common/entity/pagination';
import {
  ApplicationCreatePayload,
  ApplicationReplacePayload,
  ApplicationUpdatePayload,
} from './payload';
import { Loader } from './pipe';

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
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards)
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
    const { organization } = request;

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
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards)
  @ApiOperation({ summary: 'Retrieve Application By ID.' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve Application By ID Request Received.',
    type: Application,
  })
  @ApiResponse({
    status: 400,
    description: 'Retrieve Application By ID Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Retrieve Application By ID Request Failed (Not found).',
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
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Replace Application By ID.',
    description: '**Inserts** Application If It does not exists By ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Replace Application By ID Request Received.',
    type: Application,
  })
  @ApiResponse({
    status: 400,
    description: 'Replace Application By ID Request Failed.',
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
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards)
  @ApiOperation({ summary: 'Update Application By ID.' })
  @ApiResponse({
    status: 200,
    description: 'Update Application By ID Request Received.',
    type: Application,
  })
  @ApiResponse({
    status: 400,
    description: 'Update Application By ID Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Update Application By ID Request Failed (Not found).',
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
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Application By ID.' })
  @ApiResponse({
    status: 204,
    description: 'Delete Application By ID Request Received.',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Delete Application By ID Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Delete Application By ID Request Failed (Not found).',
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
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards)
  @ApiOperation({ summary: 'Create Application.' })
  @ApiResponse({
    status: 201,
    description: 'Create Application Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Create Application Request Failed.',
  })
  async create(
    @Body() payload: ApplicationCreatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Application> {
    const { organization } = request;
    let application = await this.service.create(payload);

    /**
     * Attach organization to application
     */
    application.organization = organization._id;
    application = await application.save();

    return application;
  }
}
