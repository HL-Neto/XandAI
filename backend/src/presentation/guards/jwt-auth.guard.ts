import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { AuthUseCase } from '../../application/use-cases/auth.use-case';

/**
 * Guard para autenticação JWT
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authUseCase: AuthUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token de acesso não fornecido');
    }

    try {
      // Valida o token e obtém o usuário
      const user = await this.authUseCase.validateToken(token);
      
      if (!user) {
        throw new UnauthorizedException('Token inválido ou usuário não encontrado');
      }

      // Adiciona o usuário ao request para uso nos controllers
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  /**
   * Extrai o token do header Authorization
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
