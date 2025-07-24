import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from './jwt.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService, JwtAuthGuard],
  exports: [JwtAuthGuard, JwtService],
})
export class AuthModule {}