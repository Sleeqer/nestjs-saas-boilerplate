import { ACGuard } from 'nest-access-control';
import { AuthGuard } from '@nestjs/passport';
import { ObjectID } from 'typeorm';
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
  OrganizationCreatePayload,
  OrganizationReplacePayload,
  OrganizationUpdatePayload,
} from './payload';
import { Organization } from './organization.entity';
import { OrganizationLoadByIdPipe } from './pipe';
import { ParseIdPipe } from '../common/pipes';
import { OrganizationService } from './organization.service';
import { FastifyRequestInterface } from '../common/interfaces';
import { Pagination, Query as QueryPagination } from '../entity/pagination';

/**
 * Organization Paginate Response Class
 */
export class OrganizationPaginateResponse extends Pagination<Organization> {
  /**
   * Results field
   */
  @ApiProperty({ type: [] })
  results: Organization[];
}

/**
 * Organization Controller Class
 */
@ApiBearerAuth()
@ApiTags('organizations')
@Controller('organizations')
export class OrganizationController {
  /**
   * Constructor of Organization Controller Class
   * @param {OrganizationService} service Organization Service
   */
  constructor(protected readonly service: OrganizationService) {}

  /**
   * Paginate Organization objects by parameters
   * @param {QueryPagination} parameters Pagination query parameters
   * @returns {Promise<Pagination<Organization>>} Paginated Organization objects
   */
  @Get('')
  @ApiOperation({ summary: 'Paginate Organization objects.' })
  @ApiResponse({
    status: 200,
    description: `Organization List Request Received.`,
    type: OrganizationPaginateResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Organization List Request Failed.',
  })
  async index(
    @Query() parameters: QueryPagination,
  ): Promise<Pagination<Organization>> {
    return this.service.paginate(parameters);
  }

  /**
   * Retrieve Organization by id
   * @param {number | string} id Organization's id
   * @returns {Promise<Organization>} Organization object
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve Organization By id.' })
  @ApiResponse({
    status: 200,
    description: 'Organization Retrieve Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Organization Retrieve Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Organization Retrieve Request Failed (Not found).',
  })
  async get(
    @Param('id', OrganizationLoadByIdPipe)
    id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<Organization> {
    return request.locals.entity;
  }

  /**
   * Replace Organization by id
   * @param {number | string} id Organization's id
   * @param {OrganizationReplacePayload} payload Organization's payload
   * @returns {Promise<Organization>} Organization object
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Replace Organization By id.',
    description: '**Inserts** Organization If It does not exists By id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization Replace Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Organization Replace Request Failed.',
  })
  async replace(
    @Param('id', ParseIdPipe) id: number | string,
    @Body() payload: OrganizationReplacePayload,
  ): Promise<Organization> {
    return await this.service.replace(id, payload);
  }

  /**
   * Update Organization by id
   * @param {number | string} id Organization's id
   * @param {OrganizationUpdatePayload} payload Organization's payload
   * @returns {Promise<Organization>} Organization object
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update Organization by id.' })
  @ApiResponse({
    status: 200,
    description: 'Organization Update Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Organization Update Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Organization Update Request Failed (Not found).',
  })
  async update(
    @Param('id', OrganizationLoadByIdPipe) id: number | string,
    @Body() payload: OrganizationUpdatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Organization> {
    return await this.service.save(request.locals.entity, payload);
  }

  /**
   * Delete Organization by id
   * @param {number | string} id Organization's id
   * @returns {Promise<DeleteResult>} Data of deleted result
   */
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Organization By id.' })
  @ApiResponse({
    status: 204,
    description: 'Organization Delete Request Received.',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Organization Delete Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Organization Delete Request Failed (Not found).',
  })
  async destroy(
    @Param('id', OrganizationLoadByIdPipe) id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<any> {
    await this.service.remove(request.locals.entity);
    return {};
  }

  /**
   * Create Organization by payload
   * @param {OrganizationCreatePayload} payload Organization's payload
   * @returns {Promise<Organization>} Organization object
   */
  @Post()
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @ApiOperation({ summary: 'Create Organization.' })
  @ApiResponse({
    status: 201,
    description: 'Organization Create Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Organization Create Request Failed.',
  })
  async create(
    @Body() payload: OrganizationCreatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Organization> {
    const organization = await this.service.create(payload);

    // Add organization to current user
    request.user.organizations.addToSet(organization);
    await request.user.save();

    return organization;
  }
}
