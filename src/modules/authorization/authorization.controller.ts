import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

/**
 * Import local objects
 */
import { AuthService, ITokenReturnBody } from './authorization.service';
import { RegisterPayload } from './payload/register.payload';
import { LoginPayload } from './payload/login.payload';
import { MemberService } from '../member';
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
   * @param {MemberService} member Profile service
   */
  constructor(
    private readonly service: AuthService,
    private readonly member: MemberService,
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
  async profile(
    @Req() request: FastifyRequestInterface,
  ): Promise<ITokenReturnBody> {
    return request.member;
  }

  /**
   * Login route to validate and create tokens for users
   * @param {LoginPayload} payload the login dto
   */
  @Post('login')
  @ApiResponse({ status: 201, description: 'Login.' })
  @ApiResponse({
    status: 200,
    description: 'Member Login Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Member Login Request Failed.',
  })
  async login(@Body() payload: LoginPayload): Promise<ITokenReturnBody> {
    const member = await this.service.validate(payload);
    return await this.service.tokenize(member);
  }

  /**
   * Authentication route to register
   * @param {RegisterPayload} payload the registration dto
   */
  @Post('register')
  @ApiResponse({ status: 201, description: 'Register.' })
  @ApiResponse({
    status: 200,
    description: 'Member Register Request Received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Member Register Request Failed.',
  })
  async register(@Body() payload: RegisterPayload) {
    const member = await this.member.create(payload);
    return await this.service.tokenize(member);
  }
}
