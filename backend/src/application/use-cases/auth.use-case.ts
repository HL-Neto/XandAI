import { Injectable, UnauthorizedException, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { RegisterUserDto, LoginUserDto, AuthResponseDto, ChangePasswordDto, UpdateProfileDto } from '../dto/auth.dto';

/**
 * Use Case para operações de autenticação
 */
@Injectable()
export class AuthUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registra um novo usuário
   */
  async register(registerDto: RegisterUserDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, preferredLanguage, theme } = registerDto;

    // Verifica se o email já existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Cria o usuário
    const userData: Partial<User> = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      preferredLanguage,
      theme: theme || 'light',
      role: 'user',
      isActive: true,
    };

    const user = await this.userRepository.create(userData);

    // Gera tokens
    const { accessToken, expiresIn } = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      expiresIn,
    };
  }

  /**
   * Realiza login do usuário
   */
  async login(loginDto: LoginUserDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Busca o usuário pelo email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verifica se o usuário está ativo
    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo');
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Atualiza último login
    await this.userRepository.updateLastLogin(user.id);

    // Gera tokens
    const { accessToken, expiresIn } = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      expiresIn,
    };
  }

  /**
   * Obtém perfil do usuário
   */
  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Atualiza perfil do usuário
   */
  async updateProfile(userId: string, updateDto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const updatedUser = await this.userRepository.update(userId, updateDto);
    return this.sanitizeUser(updatedUser);
  }

  /**
   * Altera senha do usuário
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verifica a senha atual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Hash da nova senha
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Atualiza a senha
    await this.userRepository.changePassword(userId, hashedNewPassword);
  }

  /**
   * Valida token JWT
   */
  async validateToken(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findById(payload.sub);
      
      if (!user || !user.isActive) {
        return null;
      }

      return this.sanitizeUser(user);
    } catch (error) {
      return null;
    }
  }

  /**
   * Gera tokens de acesso
   */
  private async generateTokens(user: User): Promise<{ accessToken: string; expiresIn: number }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const expiresIn = 24 * 60 * 60; // 24 horas

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: `${expiresIn}s`,
    });

    return {
      accessToken,
      expiresIn,
    };
  }

  /**
   * Remove dados sensíveis do usuário
   */
  private sanitizeUser(user: User): any {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
