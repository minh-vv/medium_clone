import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;   

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @MinLength(8)
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsUrl()
    @IsOptional()
    image?: string;
}

