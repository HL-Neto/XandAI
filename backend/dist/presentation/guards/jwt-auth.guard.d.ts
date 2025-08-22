import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUseCase } from '../../application/use-cases/auth.use-case';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly authUseCase;
    constructor(jwtService: JwtService, authUseCase: AuthUseCase);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
