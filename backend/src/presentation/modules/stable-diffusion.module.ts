import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StableDiffusionController } from '../controllers/stable-diffusion.controller';
import { StableDiffusionService } from '../../infrastructure/services/stable-diffusion.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    PassportModule,
    JwtModule,
    AuthModule, // Importa AuthModule para ter acesso ao AuthUseCase
  ],
  controllers: [StableDiffusionController],
  providers: [StableDiffusionService],
  exports: [StableDiffusionService],
})
export class StableDiffusionModule {}
