import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
export declare const getDatabaseConfig: (configService: ConfigService) => TypeOrmModuleOptions;
export declare const databaseConfigValidation: () => {
    NODE_ENV: string;
    DB_PATH: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_SSL: string;
    DB_CONNECTION_LIMIT: number;
    DB_LOGGING: string;
};
