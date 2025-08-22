import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { RegisterUserDto, LoginUserDto, AuthResponseDto, ChangePasswordDto, UpdateProfileDto } from '../dto/auth.dto';
export declare class AuthUseCase {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: IUserRepository, jwtService: JwtService);
    register(registerDto: RegisterUserDto): Promise<AuthResponseDto>;
    login(loginDto: LoginUserDto): Promise<AuthResponseDto>;
    getProfile(userId: string): Promise<User>;
    updateProfile(userId: string, updateDto: UpdateProfileDto): Promise<User>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void>;
    validateToken(token: string): Promise<User | null>;
    private generateTokens;
    private sanitizeUser;
}
