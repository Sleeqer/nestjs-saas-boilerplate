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
  ConversationCreatePayload,
  ConversationReplacePayload,
  ConversationUpdatePayload,
} from './payload';
import { Loader } from './pipe';
import {
  Pagination,
  Query as QueryPagination,
} from '../common/entity/pagination';
import { AppRoles } from '../app/app.roles';
import { ParseIdPipe } from '../common/pipes';
import { ConversationService } from './conversation.service';
import { FastifyRequestInterface } from '../common/interfaces';
import { UserGuards } from '../authorization/guards/user.guards';
import { Conversation, ConversationDocument } from './conversation.entity';
import { BaseEntityController } from '../common/entity/controller/entity.controller';
import { ApplicationKeyGuards } from '../authorization/guards/application.key.guards';
import { ConversationGuards } from './guards';

/**
 * Conversation Paginate Response Class
 */
export class ConversationPaginateResponse extends Pagination<Conversation> {
  /**
   * Results field
   */
  @ApiProperty({ type: [Conversation] })
  results: Conversation[];
}

/**
 * Conversation Controller Class
 */
@ApiBearerAuth()
@ApiTags('conversations')
@Controller('conversations')
export class ConversationController extends BaseEntityController<
  Conversation,
  ConversationDocument
> {
  /**
   * Constructor of Conversation Controller Class
   * @param {ConversationService} service Conversation Service
   */
  constructor(protected readonly service: ConversationService) {
    super(service);
  }

  /**
   * Paginate Conversation objects by parameters
   * @param {QueryPagination} parameters Pagination query parameters
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Pagination<Conversation>>} Paginated Conversation objects
   */
  @Get('')
  @UseGuards(ApplicationKeyGuards, UserGuards)
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Paginate Conversation objects.' })
  @ApiResponse({
    status: 200,
    description: `Conversation List Request Received.`,
    type: ConversationPaginateResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Conversation List Request Failed.',
  })
  async index(
    @Query() parameters: QueryPagination,
    @Req() request: FastifyRequestInterface,
  ): Promise<Pagination<Conversation>> {
    const { application, user } = request;

    /**
     * Filtering query
     */
    parameters.filter = {
      application: application._id,
      'members.user': { $in: user._id },
    };
    return this.service.paginate(parameters);
  }

  /**
   * Retrieve Conversation by id
   * @param {number | string} id Conversation's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Conversation>} Conversation's object
   */
  @Get(':id')
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @ApiOperation({ summary: 'Retrieve Conversation By id.' })
  @ApiResponse({
    status: 200,
    description: 'Conversation Retrieve Request Received.',
    type: Conversation,
  })
  @ApiResponse({
    status: 400,
    description: 'Conversation Retrieve Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Conversation Retrieve Request Failed (Not found).',
  })
  async get(
    @Param('id')
    id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<Conversation> {
    return request.locals.conversation;
  }

  /**
   * Replace Conversation by id
   * @param {number | string} id Conversation's id
   * @param {ConversationReplacePayload} payload Conversation's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Conversation>} Conversation's object
   */
  @Put(':id')
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Replace Conversation By id.',
    description: '**Inserts** Conversation If It does not exists By id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation Replace Request Received.',
    type: Conversation,
  })
  @ApiResponse({
    status: 400,
    description: 'Conversation Replace Request Failed.',
  })
  async replace(
    @Param('id', ParseIdPipe) id: number | string,
    @Body() payload: ConversationReplacePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Conversation> {
    return await this.service.replace(id, payload);
  }

  /**
   * Update Conversation by id
   * @param {number | string} id Conversation's id
   * @param {ConversationUpdatePayload} payload Conversation's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Conversation>} Conversation's object
   */
  @Patch(':id')
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Update Conversation by id.' })
  @ApiResponse({
    status: 200,
    description: 'Conversation Update Request Received.',
    type: Conversation,
  })
  @ApiResponse({
    status: 400,
    description: 'Conversation Update Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Conversation Update Request Failed (Not found).',
  })
  async update(
    @Param('id') id: number | string,
    @Body() payload: ConversationUpdatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Conversation> {
    return await this.service.update(request.locals.conversation, payload);
  }

  /**
   * Delete Conversation by id
   * @param {number | string} id Conversation's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<object>} Empty object
   */
  @Delete(':id')
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @HttpCode(204)
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Delete Conversation By id.' })
  @ApiResponse({
    status: 204,
    description: 'Conversation Delete Request Received.',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Conversation Delete Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Conversation Delete Request Failed (Not found).',
  })
  async destroy(
    @Param('id') id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<object> {
    await this.service.destroy(request.locals.conversation._id);
    return {};
  }

  /**
   * Create Conversation by payload
   * @param {ConversationCreatePayload} payload Conversation's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Conversation>} Conversation object
   */
  @Post()
  @UseGuards(ApplicationKeyGuards, UserGuards)
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Create Conversation.' })
  @ApiResponse({
    status: 201,
    description: 'Conversation Create Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Conversation Create Request Failed.',
  })
  @ApiResponse({
    status: 401,
  })
  async create(
    @Body() payload: ConversationCreatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Conversation> {
    const { application, user } = request;

    /**
     * Attach realtions to conversation
     */
    const conversation = await this.service.create({
      ...payload,
      application: application._id,
      owner: user._id,
      members: [{ user: user._id, roles: AppRoles.ADMIN }],
    });

    return conversation;
  }
}
