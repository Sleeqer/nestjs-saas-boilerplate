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
import { OrganizationGuards, ProfileGuards } from '../authorization/guards';
import { GuardsProperty } from '../authorization/guards/decorators';
import { OrganizationKeeperGuards } from '../authorization/guards/organization.keeper.guards';

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
   */
  constructor(protected readonly service: MemberService) {
    super(service);
  }

  /**
   * Paginate Member objects by parameters
   * @param {QueryPagination} parameters Pagination query parameters
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Pagination<Member>>} Paginated Member objects
   */
  @Get('')
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards)
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
    const { organization } = request;

    /**
     * Filtering by organization
     */
    parameters.filter = { organizations: { $in: organization._id } };
    return this.service.paginate(parameters);
  }

  /**
   * Retrieve Member by id
   * @param {number | string} id Member's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Member>} Member's object
   */
  @Get(':id')
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards)
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
    return request.locals.member;
  }

  /**
   * Replace Member by id
   * @param {number | string} id Member's id
   * @param {MemberReplacePayload} payload Member's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Member>} Member's object
   */
  @Put(':id')
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards)
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
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards, OrganizationKeeperGuards)
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
    return await this.service.update(request.locals.member, payload);
  }

  /**
   * Delete Member by id
   * @param {number | string} id Member's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<object>} Empty object
   */
  @Delete(':id')
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards, OrganizationKeeperGuards)
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
    await this.service.destroy(request.locals.member._id);
    return {};
  }

  /**
   * Create Member by payload
   * @param {number | string} organization Organization's id
   * @param {MemberCreatePayload} payload Member's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Member>} Member object
   */
  @Post('')
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards)
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
  ): Promise<Member> {
    let member: any = await this.service.create(payload);

    /**
     * Attach organization to member
     */
    member.organizations.addToSet(request.organization._id);
    member = await member.save();

    return member;
  }
}
