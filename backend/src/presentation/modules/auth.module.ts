import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from '../../domain/entities/user.entity';
import { AuthUseCase } from '../../application/use-cases/auth.use-case';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { AuthController } from '../controllers/auth.controller';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * Módulo de autenticação
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'xandai-secret-key'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '24h'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    JwtAuthGuard,
  ],
  exports: [AuthUseCase, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
