import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

/**
 * Import local objects
 */
import { ProfileService } from '../profile/profile.service';
import { LoginPayload, RegisterPayload } from './payload';
import { FastifyRequestInterface } from '../common';
import { ProfileGuards } from './guards';
import { Profile } from '../profile';
import {
  AuthorizationService,
  ITokenReturnBody,
} from './authorization.service';

/**
 * Authorization Controller Class
 */
@ApiTags('authorization')
@Controller('authorization')
export class AuthorizationController {
  /**
   * Constructor of Authorization Controller Class
   * @param {AuthorizationService} service Authorization Service
   * @param {ProfileService} profile Profile Service
   */
  constructor(
    private readonly service: AuthorizationService,
    private readonly profile: ProfileService,
  ) {}

  /**
   * Retrieve Profile
   * @param {FastifyRequestInterface} request Request
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
  async profiler(@Req() request: FastifyRequestInterface): Promise<Profile> {
    return request.profile;
  }

  /**
   * Authenticate login
   * @param {LoginPayload} payload Login Payload
   */
  @Post('login')
  @ApiResponse({ status: 201, description: 'Login.' })
  @ApiResponse({
    status: 200,
    description: 'Login Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Login Request Failed.',
  })
  async login(@Body() payload: LoginPayload): Promise<ITokenReturnBody> {
    const profile = await this.service.validate(payload);
    return await this.service.tokenize(profile);
  }

  /**
   * Authenticate register
   * @param {RegisterPayload} payload Register Payload
   */
  @Post('register')
  @ApiResponse({ status: 201, description: 'Register.' })
  @ApiResponse({
    status: 200,
    description: 'Register Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Register Request Failed.',
  })
  async register(@Body() payload: RegisterPayload) {
    const profile = await this.profile.create(payload);
    return await this.service.tokenize(profile);
  }
}
