import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto, UserResponseDto, LoginResponseDto } from './dto/auth.dto';
import { User } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  private toUserResponse(user: User): UserResponseDto {
    const { password, ...rest } = user;
    return {
      ...rest,
      bio: rest.bio ?? undefined,
      image: rest.image ?? undefined,
    };
  }

  register = async (userData: RegisterDto): Promise<UserResponseDto> => {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    if (user) {
      throw new HttpException(
        { message: 'Email đã tồn tại.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await hash(userData.password, 10);

    const res = await this.prismaService.user.create({
      data: { ...userData, password: hashedPassword },
    });

    return this.toUserResponse(res);
  };

  login = async (userData: LoginDto): Promise<LoginResponseDto> => {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (!user) {
      throw new HttpException(
        { message: 'Email không tồn tại.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await compare(userData.password, user.password);

    if (!isPasswordValid) {
      throw new HttpException(
        { message: 'Mật khẩu không chính xác.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  };
}
