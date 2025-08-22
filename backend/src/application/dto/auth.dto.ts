import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsIn } from 'class-validator';

/**
 * DTO para registro de usuário
 */
export class RegisterUserDto {
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string;

  @IsString({ message: 'Primeiro nome é obrigatório' })
  @MinLength(2, { message: 'Primeiro nome deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'Primeiro nome deve ter no máximo 50 caracteres' })
  firstName: string;

  @IsString({ message: 'Sobrenome é obrigatório' })
  @MinLength(2, { message: 'Sobrenome deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'Sobrenome deve ter no máximo 50 caracteres' })
  lastName: string;

  @IsString({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  @MaxLength(100, { message: 'Senha deve ter no máximo 100 caracteres' })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  preferredLanguage?: string;

  @IsOptional()
  @IsIn(['light', 'dark'], { message: 'Tema deve ser light ou dark' })
  theme?: 'light' | 'dark';
}

/**
 * DTO para login de usuário
 */
export class LoginUserDto {
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string;

  @IsString({ message: 'Senha é obrigatória' })
  password: string;
}

/**
 * DTO para atualização de perfil
 */
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  preferredLanguage?: string;

  @IsOptional()
  @IsIn(['light', 'dark'])
  theme?: 'light' | 'dark';

  @IsOptional()
  @IsString()
  avatar?: string;
}

/**
 * DTO para alteração de senha
 */
export class ChangePasswordDto {
  @IsString({ message: 'Senha atual é obrigatória' })
  currentPassword: string;

  @IsString({ message: 'Nova senha é obrigatória' })
  @MinLength(8, { message: 'Nova senha deve ter pelo menos 8 caracteres' })
  @MaxLength(100, { message: 'Nova senha deve ter no máximo 100 caracteres' })
  newPassword: string;
}

/**
 * DTO de resposta para autenticação
 */
export class AuthResponseDto {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    theme: string;
    preferredLanguage?: string;
    avatar?: string;
    createdAt: Date;
  };
  
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}
