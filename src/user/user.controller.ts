import { Controller, Post, Body, Get, Put, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() body: CreateUserDto): Promise<UserResponseDto> {
        console.log("create user =>", body);
        return this.userService.createUser(body);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getCurrentUser(@Request() req): Promise<UserResponseDto> {
        const userId = req.user.id;
        return this.userService.getUserById(userId);
    }

    @Put('me')
    @UseGuards(JwtAuthGuard)
    updateCurrentUser(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const userId = req.user.id;
        return this.userService.updateUser(userId, updateUserDto);
    }
}
