import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

/**
 * Import local objects
 */
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { ConfigModule } from '../config/config.module';
import { ProfileModule } from '../profile/profile.module';
import { ConfigService } from '../config/config.service';
import { ApplicationStrategy } from './strategy/application.strategy';
import { ApplicationModule } from '../application/application.module';

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
    ProfileModule,
    ApplicationModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ApplicationStrategy],
  exports: [PassportModule.register({ defaultStrategy: 'jwt' })],
})

/**
 * Export module
 */
export class AuthModule {}
