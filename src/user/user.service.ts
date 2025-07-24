import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    private toUserResponse(user: User): UserResponseDto {
        const { password, ...rest } = user;
        return {
            ...rest,
            bio: rest.bio ?? undefined,
            image: rest.image ?? undefined,
        };
    }

    async createUser(body: CreateUserDto): Promise<UserResponseDto> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: body.email,
            },
        });

        if (user) {
            throw new HttpException('Email đã tồn tại', HttpStatus.BAD_REQUEST);
        }
        
        const hashedPassword = await hash(body.password, 10);

        const result = await this.prismaService.user.create({
            data: {
                ...body,
                password: hashedPassword,
            },
        });
        
        return this.toUserResponse(result);
    }

    async getUserById(id: number): Promise<UserResponseDto> {
        const user = await this.prismaService.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
        }

        return this.toUserResponse(user);
    }

    async updateUser(id: number, updateData: UpdateUserDto): Promise<UserResponseDto> {
        const user = await this.prismaService.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
        }

        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await this.prismaService.user.findUnique({
                where: { email: updateData.email },
            });

            if (existingUser) {
                throw new HttpException('Email đã tồn tại', HttpStatus.BAD_REQUEST);
            }
        }

        if (updateData.username && updateData.username !== user.username) {
            const existingUser = await this.prismaService.user.findUnique({
                where: { username: updateData.username },
            });

            if (existingUser) {
                throw new HttpException('Username đã tồn tại', HttpStatus.BAD_REQUEST);
            }
        }

        const dataToUpdate: any = { ...updateData };

        if (updateData.password) {
            dataToUpdate.password = await hash(updateData.password, 10);
        }

        const updatedUser = await this.prismaService.user.update({
            where: { id },
            data: dataToUpdate,
        });

        return this.toUserResponse(updatedUser);
    }
}
