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
  MemberCreatePayload,
  MemberReplacePayload,
  MemberUpdatePayload,
} from './payload';
import { Loader } from './pipe';
import {
  Pagination,
  Query as QueryPagination,
} from '../common/entity/pagination';
import { ParseIdPipe } from '../common/pipes';
import { MemberService } from './member.service';
import { FastifyRequestInterface } from '../common/interfaces';
import { Member, MemberDocument } from './member.entity';
import { BaseEntityController } from '../common/entity/controller/entity.controller';
import {
  ApplicationKeyGuards,
  OrganizationGuards,
  ProfileGuards,
  UserGuards,
} from '../authorization/guards';
import { GuardsProperty } from '../authorization/guards/decorators';
import { ConversationGuards } from '../conversation/guards';
import { UserService, User } from '../user';
import { ConversationService } from '../conversation';
import { AppRoles } from '../app/app.roles';

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
    @Query() parameters: QueryPagination,
    @Req() request: FastifyRequestInterface,
  ): Promise<Pagination<Member>> {
    const { conversation } = request.locals;

    /**
     * Filtering by conversation
     */
    parameters.filter = { conversations: { $in: conversation._id } };
    return this.service.paginate(parameters);
  }

  /**
   * Retrieve Member by id
   * @param {number | string} id Member's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Member>} Member's object
   */
  @Get(':id')
  @GuardsProperty({ guards: ConversationGuards, property: 'conversation' })
  @UseGuards(ApplicationKeyGuards, UserGuards)
  @ApiOperation({ summary: 'Retrieve Member By id.' })
  @ApiResponse({
    status: 200,
    description: 'Member Retrieve Request Received.',
    type: Member,
  })
  @ApiResponse({
    status: 400,
    description: 'Member Retrieve Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Member Retrieve Request Failed (Not found).',
  })
  async get(
    @Param('id', Loader)
    id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<Member> {
    return request.locals.profile;
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
  @UseGuards(ApplicationKeyGuards, UserGuards)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Replace Member By id.',
    description: '**Inserts** Member If It does not exists By id.',
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
    @Param('id', ParseIdPipe) id: number | string,
    @Body() payload: MemberReplacePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Member> {
    return await this.service.replace(id, payload);
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
  @UseGuards(ProfileGuards, OrganizationGuards)
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
    return await this.service.update(request.locals.profile, payload);
  }

  /**
   * Delete Member by id
   * @param {number | string} id Member's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<object>} Empty object
   */
  @Delete(':id')
  @GuardsProperty({ guards: ConversationGuards, property: 'conversation' })
  @UseGuards(ProfileGuards, OrganizationGuards)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Member By id.' })
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
    await this.service.destroy(request.locals.profile._id);
    return {};
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
  @ApiOperation({ summary: 'Create Member.' })
  @ApiResponse({
    status: 201,
    description: 'Member Create Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Member Create Request Failed.',
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
