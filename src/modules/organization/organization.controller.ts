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
import { Loader } from './pipe';
import {
  Pagination,
  Query as QueryPagination,
} from '../common/entity/pagination';
import { ParseIdPipe } from '../common/pipes';
import { OrganizationService } from './organization.service';
import { FastifyRequestInterface } from '../common/interfaces';
import { Organization, OrganizationDocument } from './organization.entity';
import { BaseEntityController } from '../common/entity/controller/entity.controller';
import { OrganizationGuards, ProfileGuards } from '../authorization/guards';
import { GuardsProperty } from '../authorization/guards/decorators';

/**
 * Organization Paginate Response Class
 */
export class OrganizationPaginateResponse extends Pagination<Organization> {
  /**
   * Results field
   */
  @ApiProperty({ type: [Organization] })
  results: Organization[];
}

/**
 * Organization Controller Class
 */
@ApiBearerAuth()
@ApiTags('organizations')
@Controller('/')
export class OrganizationController extends BaseEntityController<
Organization,
OrganizationDocument
> {
  /**
   * Constructor of Organization Controller Class
   * @param {OrganizationService} service Organization Service
   */
  constructor(protected readonly service: OrganizationService) {
    super(service);
  }

  /**
   * Paginate Organization objects by parameters
   * @param {QueryPagination} parameters Pagination query parameters
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Pagination<Organization>>} Paginated Organization objects
   */
  @Get('')
  @UseGuards(ProfileGuards)
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
    @Req() request: FastifyRequestInterface,
  ): Promise<Pagination<Organization>> {
    const { profile } = request;
    parameters.filter = { profile: profile._id };

    return this.service.paginate(parameters);
  }

  /**
   * Retrieve Organization by id
   * @param {number | string} id Organization's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Organization>} Organization's object
   */
  @Get(':id')
  @GuardsProperty({ guards: OrganizationGuards })
  @UseGuards(ProfileGuards, OrganizationGuards)
  @ApiOperation({ summary: 'Retrieve Organization By id.' })
  @ApiResponse({
    status: 200,
    description: 'Organization Retrieve Request Received.',
    type: Organization,
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
    @Param('id')
    id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<Organization> {
    return request.organization;
  }

  /**
   * Replace Organization by id
   * @param {number | string} id Organization's id
   * @param {OrganizationReplacePayload} payload Organization's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Organization>} Organization's object
   */
  @Put(':id')
  @UseGuards(ProfileGuards)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Replace Organization By id.',
    description: '**Inserts** Organization If It does not exists By id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization Replace Request Received.',
    type: Organization,
  })
  @ApiResponse({
    status: 400,
    description: 'Organization Replace Request Failed.',
  })
  async replace(
    @Param('id', ParseIdPipe) id: number | string,
    @Body() payload: OrganizationReplacePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Organization> {
    return await this.service.replace(id, payload);
  }

  /**
   * Update Organization by id
   * @param {number | string} id Organization's id
   * @param {OrganizationUpdatePayload} payload Organization's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Organization>} Organization's object
   */
  @Patch(':id')
  @UseGuards(ProfileGuards)
  @ApiOperation({ summary: 'Update Organization by id.' })
  @ApiResponse({
    status: 200,
    description: 'Organization Update Request Received.',
    type: Organization,
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
    @Param('id', Loader) id: number | string,
    @Body() payload: OrganizationUpdatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Organization> {
    return await this.service.update(request.organization, payload);
  }

  /**
   * Delete Organization by id
   * @param {number | string} id Organization's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<object>} Empty object
   */
  @Delete(':id')
  @UseGuards(ProfileGuards)
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
    @Param('id', Loader) id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<object> {
    await this.service.destroy(request.organization._id);
    return {};
  }

  /**
   * Create Organization by payload
   * @param {OrganizationCreatePayload} payload Organization's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Organization>} Organization object
   */
  @Post()
  @UseGuards(ProfileGuards)
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
    const { profile } = request;
    const organization = await this.service.create({
      ...payload,
      profile: profile._id,
    });

    /**
     * Attach organization to profile
     */
    profile.organizations.addToSet(organization);
    await profile.save()

    return organization;
  }
}
