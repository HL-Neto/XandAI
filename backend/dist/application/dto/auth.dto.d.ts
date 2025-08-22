export declare class RegisterUserDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    preferredLanguage?: string;
    theme?: 'light' | 'dark';
}
export declare class LoginUserDto {
    email: string;
    password: string;
}
export declare class UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    preferredLanguage?: string;
    theme?: 'light' | 'dark';
    avatar?: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class AuthResponseDto {
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
