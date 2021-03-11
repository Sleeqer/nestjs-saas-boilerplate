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
  UserCreatePayload,
  UserReplacePayload,
  UserUpdatePayload,
} from './payload';
import { Loader } from './pipe';
import {
  Pagination,
  Query as QueryPagination,
} from '../common/entity/pagination';
import { ParseIdPipe } from '../common/pipes';
import { UserService } from './user.service';
import { FastifyRequestInterface } from '../common/interfaces';
import { User, UserDocument } from './user.entity';
import { BaseEntityController } from '../common/entity/controller/entity.controller';

/**
 * User Paginate Response Class
 */
export class UserPaginateResponse extends Pagination<User> {
  /**
   * Results field
   */
  @ApiProperty({ type: [User] })
  results: User[];
}

/**
 * User Controller Class
 */
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController extends BaseEntityController<User, UserDocument> {
  /**
   * Constructor of User Controller Class
   * @param {UserService} service User Service
   */
  constructor(protected readonly service: UserService) {
    super(service);
  }

  /**
   * Paginate User objects by parameters
   * @param {QueryPagination} parameters Pagination query parameters
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<Pagination<User>>} Paginated User objects
   */
  @Get('')
  @UseGuards(AuthGuard('jwt'))
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Paginate User objects.' })
  @ApiResponse({
    status: 200,
    description: `User List Request Received.`,
    type: UserPaginateResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'User List Request Failed.',
  })
  async index(
    @Query() parameters: QueryPagination,
    @Req() request: FastifyRequestInterface,
  ): Promise<Pagination<User>> {
    return this.service.paginate(parameters);
  }

  /**
   * Retrieve User by id
   * @param {number | string} id User's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<User>} User's object
   */
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Retrieve User By id.' })
  @ApiResponse({
    status: 200,
    description: 'User Retrieve Request Received.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'User Retrieve Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'User Retrieve Request Failed (Not found).',
  })
  async get(
    @Param('id', Loader)
    id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<User> {
    return request.locals.user;
  }

  /**
   * Replace User by id
   * @param {number | string} id User's id
   * @param {UserReplacePayload} payload User's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<User>} User's object
   */
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Replace User By id.',
    description: '**Inserts** User If It does not exists By id.',
  })
  @ApiResponse({
    status: 200,
    description: 'User Replace Request Received.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'User Replace Request Failed.',
  })
  async replace(
    @Param('id', ParseIdPipe) id: number | string,
    @Body() payload: UserReplacePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<User> {
    return await this.service.replace(id, payload);
  }

  /**
   * Update User by id
   * @param {number | string} id User's id
   * @param {UserUpdatePayload} payload User's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<User>} User's object
   */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Update User by id.' })
  @ApiResponse({
    status: 200,
    description: 'User Update Request Received.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'User Update Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'User Update Request Failed (Not found).',
  })
  async update(
    @Param('id', Loader) id: number | string,
    @Body() payload: UserUpdatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<User> {
    return await this.service.update(request.locals.user, payload);
  }

  /**
   * Delete User by id
   * @param {number | string} id User's id
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<object>} Empty object
   */
  @Delete(':id')
  @HttpCode(204)
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Delete User By id.' })
  @ApiResponse({
    status: 204,
    description: 'User Delete Request Received.',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'User Delete Request Failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'User Delete Request Failed (Not found).',
  })
  async destroy(
    @Param('id', Loader) id: number | string,
    @Req() request: FastifyRequestInterface,
  ): Promise<object> {
    await this.service.destroy(request.locals.user._id);
    return {};
  }

  /**
   * Create User by payload
   * @param {UserCreatePayload} payload User's payload
   * @param {FastifyRequestInterface} request Request's object
   * @returns {Promise<User>} User object
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Create User.' })
  @ApiResponse({
    status: 201,
    description: 'User Create Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'User Create Request Failed.',
  })
  async create(
    @Body() payload: UserCreatePayload,
    @Req() request: FastifyRequestInterface,
  ): Promise<User> {
    const user = await this.service.create(payload);
    return user;
  }
}
