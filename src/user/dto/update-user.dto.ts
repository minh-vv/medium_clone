import { IsEmail, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    username?: string;

    @IsEmail()
    @IsOptional()
    email?: string;
    
    @MinLength(8)
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsUrl()
    @IsOptional()
    image?: string;
}