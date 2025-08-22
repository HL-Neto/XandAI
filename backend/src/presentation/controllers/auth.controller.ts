import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';

import { AuthUseCase } from '../../application/use-cases/auth.use-case';
import { 
  RegisterUserDto, 
  LoginUserDto, 
  AuthResponseDto, 
  ChangePasswordDto, 
  UpdateProfileDto 
} from '../../application/dto/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * Controller responsável pelas operações de autenticação
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  /**
   * Health check endpoint
   */
  @Get('/health')
  @HttpCode(HttpStatus.OK)
  health(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Registra um novo usuário
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(ValidationPipe) registerDto: RegisterUserDto,
  ): Promise<AuthResponseDto> {
    return await this.authUseCase.register(registerDto);
  }

  /**
   * Realiza login do usuário
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: LoginUserDto,
  ): Promise<AuthResponseDto> {
    return await this.authUseCase.login(loginDto);
  }

  /**
   * Obtém perfil do usuário autenticado
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req): Promise<any> {
    return await this.authUseCase.getProfile(req.user.id);
  }

  /**
   * Atualiza perfil do usuário autenticado
   */
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req,
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
  ): Promise<any> {
    return await this.authUseCase.updateProfile(req.user.id, updateProfileDto);
  }

  /**
   * Altera senha do usuário autenticado
   */
  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @Request() req,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return await this.authUseCase.changePassword(req.user.id, changePasswordDto);
  }

  /**
   * Verifica se o token JWT é válido
   */
  @Get('verify')
  @UseGuards(JwtAuthGuard)
  async verifyToken(@Request() req): Promise<{ valid: boolean; user: any }> {
    return {
      valid: true,
      user: req.user,
    };
  }
}
