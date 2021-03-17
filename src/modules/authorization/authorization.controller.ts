import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

/**
 * Import local objects
 */
import { AuthService, ITokenReturnBody } from './authorization.service';
import { RegisterPayload } from './payload/register.payload';
import { LoginPayload } from './payload/login.payload';
import { ProfileService } from '../profile';
import { ProfileGuards } from './guards';
import { FastifyRequestInterface } from '../common/interfaces';

/**
 * Authentication Controller Class
 */
@ApiTags('authorization')
@Controller('authorization')
export class AuthController {
  /**
   * Constructor of Authentication Controller Class
   * @param {AuthService} service Authentication service
   * @param {ProfileService} profile Profile service
   */
  constructor(
    private readonly service: AuthService,
    private readonly profile: ProfileService,
  ) {}

  /**
   * Login route to validate and create tokens for users
   * @param {LoginPayload} payload the login dto
   */
  @Get('profile')
  @UseGuards(ProfileGuards)
  @ApiResponse({ status: 201, description: 'Retrieve profile.' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve Profile Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Retrieve Profile Request Failed.',
  })
  async profiler(
    @Req() request: FastifyRequestInterface,
  ): Promise<ITokenReturnBody> {
    return request.profile;
  }

  /**
   * Login route to validate and create tokens for users
   * @param {LoginPayload} payload the login dto
   */
  @Post('login')
  @ApiResponse({ status: 201, description: 'Login.' })
  @ApiResponse({
    status: 200,
    description: 'Profile Login Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Profile Login Request Failed.',
  })
  async login(@Body() payload: LoginPayload): Promise<ITokenReturnBody> {
    const profile = await this.service.validate(payload);
    return await this.service.tokenize(profile);
  }

  /**
   * Authentication route to register
   * @param {RegisterPayload} payload the registration dto
   */
  @Post('register')
  @ApiResponse({ status: 201, description: 'Register.' })
  @ApiResponse({
    status: 200,
    description: 'Profile Register Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Profile Register Request Failed.',
  })
  async register(@Body() payload: RegisterPayload) {
    const profile = await this.profile.create(payload);
    return await this.service.tokenize(profile);
  }
}
