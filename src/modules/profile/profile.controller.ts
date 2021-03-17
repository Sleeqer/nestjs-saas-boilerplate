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
  ProfileCreatePayload,
  ProfileReplacePayload,
  ProfileUpdatePayload,
} from './payload';
import { Loader } from './pipe';
import {
  Pagination,
  Query as QueryPagination,
} from '../common/entity/pagination';
import { ParseIdPipe } from '../common/pipes';
import { ProfileService } from './profile.service';
import { FastifyRequestInterface } from '../common/interfaces';
import { Profile, ProfileDocument } from './profile.entity';
import { BaseEntityController } from '../common/entity/controller/entity.controller';
import { OrganizationGuards, ProfileGuards } from '../authorization/guards';
import { GuardsProperty } from '../authorization/guards/decorators';
import { OrganizationKeeperGuards } from '../authorization/guards/organization.keeper.guards';

/**
 * Profile Paginate Response Class
 */
export class ProfilePaginateResponse extends Pagination<Profile> {
  /**
   * Results field
   */
  @ApiProperty({ type: [Profile] })
  results: Profile[];
}

/**
 * Profile Controller Class
 */
@ApiBearerAuth()
@ApiTags('Profiles')
@Controller('/')
export class ProfileController extends BaseEntityController<
  Profile,
  ProfileDocument
> {
  /**
   * Constructor of Profile Controller Class
   * @param {ProfileService} service Profile Service
   */
  constructor(protected readonly service: ProfileService) {
    super(service);
  }

  /**
   * Paginate Profile objects by parameters
   * @param {QueryPagination} parameters Pagination query parameters
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Pagination<Profile>>} Paginated Profile objects
   */
  @Get('')
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards)
  @ApiOperation({ summary: 'Paginate Profile objects.' })
  @ApiResponse({
    status: 200,
    description: `Profile List Request Received.`,
    type: ProfilePaginateResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Profile List Request Failed.',
  })
  async index(
    @Query() parameters: QueryPagination,
    @Req() request: FastifyRequestInterface,
  ): Promise<Pagination<Profile>> {
    const { organization } = request;

    /**
     * Filtering by organization
     */
    parameters.filter = { organizations: { $in: organization._id } };
    return this.service.paginate(parameters);
  }

  /**
   * Retrieve Profile by id
   * @param {number | string} id Profile's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Profile>} Profile's object
   */
  @Get(':id')
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards)
  @ApiOperation({ summary: 'Retrieve Profile By id.' })
  @ApiResponse({
    status: 200,
    description: 'Profile Retrieve Request Received.',
    type: Profile,
  })
  @ApiResponse({
    status: 400,
    description: 'Profile Retrieve Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Profile Retrieve Request Failed (Not found).',
  })
  async get(
    @Param('id', Loader)
    id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<Profile> {
    return request.locals.profile;
  }

  /**
   * Replace Profile by id
   * @param {number | string} id Profile's id
   * @param {ProfileReplacePayload} payload Profile's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Profile>} Profile's object
   */
  @Put(':id')
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards)
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Replace Profile By id.',
    description: '**Inserts** Profile If It does not exists By id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile Replace Request Received.',
    type: Profile,
  })
  @ApiResponse({
    status: 400,
    description: 'Profile Replace Request Failed.',
  })
  async replace(
    @Param('id', ParseIdPipe) id: number | string,
    @Body() payload: ProfileReplacePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Profile> {
    return await this.service.replace(id, payload);
  }

  /**
   * Update Profile by id
   * @param {number | string} id Profile's id
   * @param {ProfileUpdatePayload} payload Profile's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Profile>} Profile's object
   */
  @Patch(':id')
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards, OrganizationKeeperGuards)
  @ApiOperation({ summary: 'Update Profile by id.' })
  @ApiResponse({
    status: 200,
    description: 'Profile Update Request Received.',
    type: Profile,
  })
  @ApiResponse({
    status: 400,
    description: 'Profile Update Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Profile Update Request Failed (Not found).',
  })
  async update(
    @Param('id', Loader) id: number | string,
    @Body() payload: ProfileUpdatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Profile> {
    return await this.service.update(request.locals.profile, payload);
  }

  /**
   * Delete Profile by id
   * @param {number | string} id Profile's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<object>} Empty object
   */
  @Delete(':id')
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards, OrganizationKeeperGuards)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Profile By id.' })
  @ApiResponse({
    status: 204,
    description: 'Profile Delete Request Received.',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Profile Delete Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Profile Delete Request Failed (Not found).',
  })
  async destroy(
    @Param('id', Loader) id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<object> {
    await this.service.destroy(request.locals.profile._id);
    return {};
  }

  /**
   * Create Profile by payload
   * @param {number | string} organization Organization's id
   * @param {ProfileCreatePayload} payload Profile's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Profile>} Profile object
   */
  @Post('')
  @GuardsProperty({ guards: OrganizationGuards, property: 'organization' })
  @UseGuards(ProfileGuards, OrganizationGuards)
  @ApiOperation({ summary: 'Create Profile.' })
  @ApiResponse({
    status: 201,
    description: 'Profile Create Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Profile Create Request Failed.',
  })
  async create(
    @Body() payload: ProfileCreatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<Profile> {
    let profile: any = await this.service.create(payload);

    /**
     * Attach organization to profile
     */
    profile.organizations.addToSet(request.organization._id);
    profile = await profile.save();

    return profile;
  }
}
