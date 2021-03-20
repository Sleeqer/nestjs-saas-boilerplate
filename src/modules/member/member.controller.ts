import { Types } from 'mongoose';
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
import { GuardsProperty } from '../authorization/guards/decorators';
import { ConversationGuards } from '../conversation/guards';
import { Member, MemberDocument } from './member.entity';
import { FastifyRequestInterface } from '../common';
import { UserService } from '../user/user.service';
import { MemberService } from './member.service';
import { AppRoles } from '../app/app.roles';
import { User } from '../user/user.entity';
import {
  Pagination,
  Query as QueryPagination,
} from '../common/entity/pagination';
import {
  MemberCreatePayload,
  MemberReplacePayload,
  MemberUpdatePayload,
} from './payload';
import { Loader } from './pipe';

/**
 * Member Paginate Response Class
 */
export class MemberPaginateResponse extends Pagination<Member> {
  /**
   * Results field
   */
  @ApiProperty({ type: [Member] })
  results: Member[];
}

/**
 * Member Controller Class
 */
@ApiBearerAuth()
@ApiTags('Members')
@Controller('/')
export class MemberController extends BaseEntityController<
  Member,
  MemberDocument
> {
  /**
   * Constructor of Member Controller Class
   * @param {MemberService} service Member Service
   * @param {ConversationService} conversation Conversation Service
   * @param {UserService} user User Service
   */
  constructor(
    protected readonly service: MemberService,
    protected readonly conversation: ConversationService,
    protected readonly user: UserService,
  ) {
    super(service);
  }

  /**
   * Paginate Member objects by parameters
   * @param {QueryPagination} parameters Pagination query parameters
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Pagination<Member>>} Paginated Member objects
   */
  @Get('')
  @GuardsProperty({ guards: ConversationGuards, property: 'conversation' })
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @ApiOperation({ summary: 'Paginate Member objects.' })
  @ApiResponse({
    status: 200,
    description: `Member List Request Received.`,
    type: MemberPaginateResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Member List Request Failed.',
  })
  async index(
    @Query() { limit, page }: QueryPagination,
    @Req() request: FastifyRequestInterface,
  ): Promise<Pagination<Member>> {
    const { conversation } = request.locals;
    const { members, members_counts } = conversation;

    return new Pagination<Member>({
      results: members.slice((page - 1) * limit, page * limit),
      total: members_counts,
      page,
      limit,
    });
  }

  /**
   * Retrieve Member by id
   * @param {number | string} id Member's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Member>} Member's object
   */
  @Get(':id')
  @GuardsProperty({ guards: ConversationGuards, property: 'conversation' })
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @ApiOperation({ summary: 'Retrieve Member By ID.' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve Member Request Received.',
    type: Member,
  })
  @ApiResponse({
    status: 400,
    description: 'Retrieve Member Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Retrieve Member Request Failed (Not found).',
  })
  async get(
    @Param('id', Loader)
    id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<Member> {
    const { locals } = request;
    const { conversation, member } = locals;
    const { members } = conversation;

    /**
     * Validate if user is member of conversation
     */
    if (!conversation.members_ids.includes(member._id))
      throw this.service._NotFoundException();

    return members.find(({ _id }: Member) =>
      (_id as Types.ObjectId).equals(member._id),
    );
  }

  /**
   * Replace Member by id
   * @param {number | string} id Member's id
   * @param {MemberReplacePayload} payload Member's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Member>} Member's object
   */
  @Put(':id')
  @GuardsProperty({ guards: ConversationGuards, property: 'conversation' })
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Replace Member By ID.',
    description: '**Inserts** Member If It does not exists By ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Member Replace Request Received.',
    type: Member,
  })
  @ApiResponse({
    status: 400,
    description: 'Member Replace Request Failed.',
  })
  async replace(
    @Param('id', Loader) id: number | string,
    @Body() payload: MemberReplacePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Member> {
    const { locals } = request;
    const { conversation, member } = locals;

    /**
     * Finding participant & updating references
     */
    this.service.updater(this.service.finder(conversation, member), payload);

    /**
     * Update participant
     */
    const conference = await this.conversation.save(conversation);
    return this.service.finder(conference, member);
  }

  /**
   * Update Member by id
   * @param {number | string} id Member's id
   * @param {MemberUpdatePayload} payload Member's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Member>} Member's object
   */
  @Patch(':id')
  @GuardsProperty({ guards: ConversationGuards, property: 'conversation' })
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @ApiOperation({ summary: 'Update Member by id.' })
  @ApiResponse({
    status: 200,
    description: 'Member Update Request Received.',
    type: Member,
  })
  @ApiResponse({
    status: 400,
    description: 'Member Update Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Member Update Request Failed (Not found).',
  })
  async update(
    @Param('id', Loader) id: number | string,
    @Body() payload: MemberUpdatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Member> {
    const { locals } = request;
    const { conversation, member } = locals;

    /**
     * Finding participant & updating references
     */
    this.service.updater(this.service.finder(conversation, member), payload);

    /**
     * Update participant
     */
    const conference = await this.conversation.save(conversation);
    return this.service.finder(conference, member);
  }

  /**
   * Create Member by id
   * @param {number | string} id Member's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<object>} Empty object
   */
  @Post(':id')
  @GuardsProperty({ guards: ConversationGuards, property: 'conversation' })
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @ApiOperation({ summary: 'Create Member By ID.' })
  @ApiResponse({
    status: 204,
    description: 'Create Member Request Received.',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Create Member Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Create Member Request Failed (Not found).',
  })
  async creator(
    @Param('id', Loader) id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<object> {
    const { locals } = request;
    const { conversation, member } = locals;

    /**
     * Detach member to conversation
     */
    conversation.members.addToSet({
      _id: member._id,
      user: member._id,
    });
    return await this.conversation.save(conversation);
  }

  /**
   * Delete Member by id
   * @param {number | string} id Member's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<object>} Empty object
   */
  @Delete(':id')
  @GuardsProperty({ guards: ConversationGuards, property: 'conversation' })
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Member By ID.' })
  @ApiResponse({
    status: 204,
    description: 'Member Delete Request Received.',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Member Delete Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Member Delete Request Failed (Not found).',
  })
  async destroy(
    @Param('id', Loader) id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<object> {
    const { locals } = request;
    const { conversation, member } = locals;

    /**
     * Validate if user is member of conversation
     */
    const participant: Member = this.service.finder(conversation, member);

    /**
     * Detach member to conversation
     */
    conversation.members.pull({
      _id: participant._id,
      user: participant._id,
    });
    return await this.conversation.save(conversation);
  }

  /**
   * Delete Member by payload
   * @param {number | string} conversation Organization's id
   * @param {MemberCreatePayload} payload Member's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Member>} Member object
   */
  @Delete('')
  @GuardsProperty({ guards: ConversationGuards, property: 'conversation' })
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @ApiOperation({ summary: 'Delete Members.' })
  @ApiResponse({
    status: 201,
    description: 'Delete Members Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Delete Members Request Failed.',
  })
  async delete(
    @Body() payload: MemberCreatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Member | any> {
    const { application, locals } = request;
    const { conversation } = locals;
    const users = await this.user.all({
      _id: { $in: payload.members },
      application: application._id,
    });

    /**
     * Detach members to conversation
     */
    conversation.members.pull(
      ...users.map((user: User) => {
        return {
          _id: user._id,
          user: user._id,
        };
      }),
    );
    return await this.conversation.save(conversation);
  }

  /**
   * Create Member by payload
   * @param {number | string} conversation Organization's id
   * @param {MemberCreatePayload} payload Member's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Member>} Member object
   */
  @Post('')
  @GuardsProperty({ guards: ConversationGuards, property: 'conversation' })
  @UseGuards(ApplicationKeyGuards, UserGuards, ConversationGuards)
  @ApiOperation({ summary: 'Create Members.' })
  @ApiResponse({
    status: 201,
    description: 'Create Members Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Create Members Request Failed.',
  })
  async create(
    @Body() payload: MemberCreatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Member | any> {
    const { application, locals } = request;
    const { conversation } = locals;
    const users = await this.user.all({
      _id: { $in: payload.members },
      application: application._id,
    });

    /**
     * Attach members to conversation
     */
    conversation.members.addToSet(
      ...users.map((user: User) => {
        return {
          _id: user._id,
          user: user._id,
          roles: AppRoles.ADMIN,
        };
      }),
    );
    return await this.conversation.save(conversation);
  }
}
