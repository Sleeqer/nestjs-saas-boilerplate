import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

/**
 * Import local objects
 */
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { ConfigModule, ConfigService } from '../config';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user';

/**
 * Declare module
 */
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
  controllers: [AuthorizationController],
  providers: [AuthorizationService, JwtStrategy],
  exports: [PassportModule.register({ defaultStrategy: 'jwt' })],
})

/**
 * Export module
 */
export class AuthModule {}
