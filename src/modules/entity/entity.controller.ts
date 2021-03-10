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
  UseInterceptors,
} from '@nestjs/common';

/**
 * Import local objects
 */
import {
  EntityCreatePayload,
  EntityReplacePayload,
  EntityUpdatePayload,
} from './payload';
import { Loader } from './pipe';
import {
  Pagination,
  Query as QueryPagination,
} from '../common/entity/pagination';
import { ParseIdPipe } from '../common/pipes';
import { EntityService } from './entity.service';
import { Entity, EntityDocument } from './entity.entity';
import { FastifyRequestInterface } from '../common/interfaces';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { BaseEntityController } from '../common/entity/controller/entity.controller';

/**
 * Entity Paginate Response Class
 */
export class EntityPaginateResponse extends Pagination<Entity> {
  /**
   * Results field
   */
  @ApiProperty({ type: [Entity] })
  results: Entity[];
}

/**
 * Entity Controller Class
 */
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth()
@ApiTags('entities')
@Controller('entities')
export class EntityController extends BaseEntityController<
  Entity,
  EntityDocument
> {
  /**
   * Constructor of Entity Controller Class
   * @param {EntityService} service Entity Service
   */
  constructor(protected readonly service: EntityService) {
    super(service);
  }

  /**
   * Paginate Entity objects by parameters
   * @param {QueryPagination} parameters Pagination query parameters
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Pagination<Entity>>} Paginated Entity objects
   */
  @Get('')
  @ApiOperation({ summary: 'Paginate Entity objects.' })
  @ApiResponse({
    status: 200,
    description: `Entity List Request Received.`,
    type: EntityPaginateResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Entity List Request Failed.',
  })
  async index(
    @Query() parameters: QueryPagination,
    @Req() request: FastifyRequestInterface,
  ): Promise<Pagination<Entity>> {
    return this.service.paginate(parameters);
  }

  /**
   * Retrieve Entity by id
   * @param {number | string} id Entity's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Entity>} Entity's object
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve Entity By id.' })
  @ApiResponse({
    status: 200,
    description: 'Entity Retrieve Request Received.',
    type: Entity,
  })
  @ApiResponse({ status: 400, description: 'Entity Retrieve Request Failed.' })
  @ApiResponse({
    status: 404,
    description: 'Entity Retrieve Request Failed (Not found).',
  })
  async get(
    @Param('id', Loader)
    id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<Entity> {
    return request.locals.entity;
  }

  /**
   * Replace Entity by id
   * @param {number | string} id Entity's id
   * @param {EntityReplacePayload} payload Entity's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Entity>} Entity's object
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Replace Entity By id.',
    description: '**Inserts** Entity If It does not exists By id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Entity Replace Request Received.',
    type: Entity,
  })
  @ApiResponse({ status: 400, description: 'Entity Replace Request Failed.' })
  async replace(
    @Param('id', ParseIdPipe) id: number | string,
    @Body() payload: EntityReplacePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Entity> {
    return await this.service.replace(id, payload);
  }

  /**
   * Update Entity by id
   * @param {number | string} id Entity's id
   * @param {EntityUpdatePayload} payload Entity's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Entity>} Entity's object
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update Entity by id.' })
  @ApiResponse({
    status: 200,
    description: 'Entity Update Request Received.',
    type: Entity,
  })
  @ApiResponse({
    status: 400,
    description: 'Entity Update Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Entity Update Request Failed (Not found).',
  })
  async update(
    @Param('id', Loader) id: number | string,
    @Body() payload: EntityUpdatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Entity> {
    return await this.service.update(request.locals.entity, payload);
  }

  /**
   * Delete Entity by id
   * @param {number | string} id Entity's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<object>} Empty object
   */
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Entity By id.' })
  @ApiResponse({
    status: 204,
    description: 'Entity Delete Request Received.',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Entity Delete Request Failed.' })
  @ApiResponse({
    status: 404,
    description: 'Entity Delete Request Failed (Not found).',
  })
  async destroy(
    @Param('id', Loader) id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<object> {
    await this.service.destroy(request.locals.entity._id);
    return {};
  }

  /**
   * Create Entity by payload
   * @param {EntityCreatePayload} payload Entity's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Entity>} Entity object
   */
  @Post()
  @ApiOperation({ summary: 'Create Entity.' })
  @ApiResponse({
    status: 201,
    description: 'Entity Create Request Received.',
  })
  @ApiResponse({ status: 400, description: 'Entity Create Request Failed.' })
  async create(
    @Body() payload: EntityCreatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Entity> {
    return await this.service.create(payload);
  }
}
