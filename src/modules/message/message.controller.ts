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
  Get,
  Patch,
  HttpCode,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';

/**
 * Import local objects
 */
import { BaseEntityController } from '../common/entity/controller/entity.controller';
import { ApplicationKeyGuards, UserGuards } from '../authorization/guards';
import { ConversationService } from '../conversation/conversation.service';
import { MessageCreatePayload, MessageUpdatePayload } from './payload';
import { GuardsProperty } from '../authorization/guards/decorators';
import { Message, MessageDocument } from './message.entity';
import { ConversationGuards } from '../conversation/guards';
import { Pagination } from '../common/entity/pagination';
import { FastifyRequestInterface } from '../common';
import { MessageService } from './message.service';
import { UserService } from '../user/user.service';
import { QueryPagination } from './query';
import { Loader } from './pipe';

/**
 * Message Paginate Response Class
 */
export class MessagePaginateResponse extends Pagination<Message> {
  /**
   * Results field
   */
  @ApiProperty({ type: [Message] })
  results: Message[];
}

/**
 * Message Controller Class
 */
@ApiBearerAuth()
@ApiTags('Messages')
@Controller('/')
export class MessageController extends BaseEntityController<
  Message,
  MessageDocument
> {
  /**
   * Constructor of Message Controller Class
   * @param {MessageService} service Message Service
   * @param {ConversationService} conversation Conversation Service
   * @param {UserService} user User Service
   */
  constructor(
    protected readonly service: MessageService,
    protected readonly conversation: ConversationService,
    protected readonly user: UserService,
  ) {
    super(service);
  }

  /**
   * Paginate Message objects by parameters
   * @param {QueryPagination} parameters Pagination query parameters
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Pagination<Message>>} Paginated Message objects
   */
  @Get('')
  @GuardsProperty({ guards: ConversationGuards, property: 'conversation' })
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @ApiOperation({ summary: 'Paginate Message objects.' })
  @ApiResponse({
    status: 200,
    description: `Message List Request Received.`,
    type: MessagePaginateResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Message List Request Failed.',
  })
  async index(
    @Query() parameters: QueryPagination,
    @Req() request: FastifyRequestInterface,
  ): Promise<Pagination<Message>> {
    const { locals } = request;
    const { conversation } = locals;
    const { before, after } = parameters;

    /**
     * Filtering query
     */
    parameters.filter = {
      conversation: conversation._id,
      ...(before && {
        _id: { $lt: before },
      }),
      ...(after && {
        _id: { $gt: after },
      }),
    };
    return this.service.paginate(parameters);
  }

  /**
   * Retrieve Message by id
   * @param {number | string} id Message's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Message>} Message's object
   */
  @Get(':id')
  @GuardsProperty({ guards: ConversationGuards, property: 'conversation' })
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @ApiOperation({ summary: 'Retrieve Message By ID.' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve Message Request Received.',
    type: Message,
  })
  @ApiResponse({
    status: 400,
    description: 'Retrieve Message Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Retrieve Message Request Failed (Not found).',
  })
  async get(
    @Param('id', Loader)
    id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<Message> {
    const { conversation, message } = request.locals;

    /**
     * Retrieve message
     */
    return this.service.finder(conversation, message);
  }

  /**
   * Update Message by id
   * @param {number | string} id Message's id
   * @param {MessageUpdatePayload} payload Message's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Message>} Message's object
   */
  @Patch(':id')
  @GuardsProperty({ guards: ConversationGuards, property: 'conversation' })
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @ApiOperation({ summary: 'Update Message by id.' })
  @ApiResponse({
    status: 200,
    description: 'Message Update Request Received.',
    type: Message,
  })
  @ApiResponse({
    status: 400,
    description: 'Message Update Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Message Update Request Failed (Not found).',
  })
  async update(
    @Param('id', Loader) id: number | string,
    @Body() payload: MessageUpdatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Message> {
    const { locals } = request;
    const { conversation, message } = locals;

    /**
     * Finding message & updating references
     */
    this.service.updater(this.service.finder(conversation, message), payload);

    /**
     * Update message
     */
    return await this.service.save(message);
  }

  /**
   * Delete Message by id
   * @param {number | string} id Message's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<object>} Empty object
   */
  @Delete(':id')
  @GuardsProperty({ guards: ConversationGuards, property: 'conversation' })
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Message By ID.' })
  @ApiResponse({
    status: 204,
    description: 'Message Delete Request Received.',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Message Delete Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Message Delete Request Failed (Not found).',
  })
  async destroy(
    @Param('id', Loader) id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<object> {
    const { locals } = request;
    const { conversation } = locals;

    const message: Message = this.service.finder(conversation, locals.message);
    await this.service.destroy(message._id as string);
    return {};
  }

  /**
   * Create Message by payload
   * @param {number | string} conversation Organization's id
   * @param {MessageCreatePayload} payload Message's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Message>} Message object
   */
  @Post('')
  @GuardsProperty({ guards: ConversationGuards, property: 'conversation' })
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @ApiOperation({ summary: 'Create Message.' })
  @ApiResponse({
    status: 201,
    description: 'Create Message Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Create Message Request Failed.',
  })
  async create(
    @Body() payload: MessageCreatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Message | any> {
    const { application, locals, user } = request;
    const { conversation } = locals;
    const message = await this.service.create({
      ...payload,
      application: application._id,
      conversation: conversation._id,
      author: user._id,
    });

    return message;
  }
}
