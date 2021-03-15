import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

/**
 * Import local objects
 */
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './authorization.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './authorization.controller';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { ApplicationStrategy } from './strategy/application.strategy';
import { ApplicationKeyStrategy } from './strategy/application.key.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('WEBTOKEN_SECRET_KEY'),
          signOptions: {
            ...(configService.get('WEBTOKEN_EXPIRATION_TIME')
              ? {
                expiresIn: Number(
                  configService.get('WEBTOKEN_EXPIRATION_TIME'),
                ),
              }
              : {}),
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ApplicationStrategy, ApplicationKeyStrategy],
  exports: [PassportModule.register({ defaultStrategy: 'jwt' })],
})

/**
 * Export module
 */
export class AuthModule { }
