import { ObjectID } from 'typeorm';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
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
} from '@nestjs/common';

/**
 * Import local level objects
 */
import {
  EntityCreatePayload,
  EntityReplacePayload,
  EntityUpdatePayload,
} from './payload';
import { Entity } from './entity.entity';
import { EntityService } from './entity.service';
import { Pagination, Query as QueryPagination } from '../entity/pagination';
import { ParseIdPipe } from '../common/pipes';

/**
 * Entity Controller Class
 */
@ApiBearerAuth()
@ApiTags('entities')
@Controller('entities')
export class EntityController {
  /**
   * Constructor of Entity Controller Class
   * @param {EntityService} service Entity Service
   */
  constructor(protected readonly service: EntityService) {}

  /**
   * Paginate Entity objects by parameters
   * @param {QueryPagination} parameters Pagination query parameters
   * @returns {Promise<Pagination<Entity>>} Paginated Entity objects
   */
  @Get('')
  @ApiOperation({ summary: 'Paginate Entity objects.' })
  @ApiResponse({
    status: 200,
    description: `Entity List Request Received.`,
  })
  @ApiResponse({
    status: 400,
    description: 'Entity List Request Failed.',
  })
  async index(
    @Query() parameters: QueryPagination,
  ): Promise<Pagination<Entity>> {
    return this.service.paginate(parameters);
  }

  /**
   * Retrieve Entity by id
   * @param {number | string} id Entity's id
   * @returns {Promise<Entity>} Entity object
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve Entity By id.' })
  @ApiResponse({
    status: 200,
    description: 'Entity Retrieve Request Received.',
  })
  @ApiResponse({ status: 400, description: 'Entity Retrieve Request Failed.' })
  async get(
    @Param('id', ParseIdPipe)
    id: number | string | ObjectID,
  ): Promise<Entity> {
    return await this.service.get(id);
  }

  /**
   * Replace Entity by id
   * @param {number | string} id Entity's id
   * @param {EntityReplacePayload} payload Entity's payload
   * @returns {Promise<Entity>} Entity object
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Replace Entity By id.',
    description: '**Inserts** Entity If It does not exists By id.',
  })
  @ApiResponse({ status: 200, description: 'Entity Replace Request Received.' })
  @ApiResponse({ status: 400, description: 'Entity Replace Request Failed.' })
  async replace(
    @Param('id', ParseIdPipe) id: number | string | ObjectID,
    @Body() payload: EntityReplacePayload,
  ): Promise<Entity> {
    return await this.service.replace(id, payload);
  }

  /**
   * Update Entity by id
   * @param {number | string} id Entity's id
   * @param {EntityUpdatePayload} payload Entity's payload
   * @returns {Promise<Entity>} Entity object
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update Entity by id.' })
  @ApiResponse({
    status: 200,
    description: 'Entity Update Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Entity Update Request Failed.',
  })
  async update(
    @Param('id', ParseIdPipe) id: number | string | ObjectID,
    @Body() payload: EntityUpdatePayload,
  ): Promise<Entity> {
    await this.service.update(id, payload);
    return await this.service.get(id);
  }

  /**
   * Destroy Entity by id
   * @param {number | string} id Entity's id
   * @returns {Promise<DeleteResult>} Data of deleted result
   */
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Entity By id.' })
  @ApiResponse({
    status: 204,
    description: 'Entity Destroy Request Received.',
  })
  @ApiResponse({ status: 400, description: 'Entity Destroy Request Failed.' })
  async destory(
    @Param('id', ParseIdPipe) id: number | string | ObjectID,
  ): Promise<object> {
    await this.service.destroy(id);
    return {};
  }

  /**
   * Create Entity by payload
   * @param {EntityCreatePayload} payload Entity's payload
   * @returns {Promise<Entity>} Entity object
   */
  @Post()
  @ApiOperation({ summary: 'Create Entity.' })
  @ApiResponse({ status: 201, description: 'Entity Create Request Received.' })
  @ApiResponse({ status: 400, description: 'Entity Create Request Failed.' })
  async create(@Body() payload: EntityCreatePayload): Promise<Entity> {
    return await this.service.create(payload);
  }
}
