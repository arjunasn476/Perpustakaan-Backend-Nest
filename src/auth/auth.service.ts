import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const exists = await this.prisma.user.findUnique({
        where: { username: dto.username },
      });

      if (exists) {
        throw new BadRequestException('Username sudah digunakan');
      }

      const hashed = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          password: hashed,
          role: dto.role.toUpperCase() as any,
          studentId: dto.studentId ? Number(dto.studentId) : null,
        },
      });

      return {
        message: 'User berhasil dibuat',
        userId: user.id,
      };
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException('ID Student tidak ditemukan di database');
      }
      if (error instanceof BadRequestException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Gagal melakukan registrasi');
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      studentId: user.studentId,
    };

    return {
      message: 'Login berhasil',
      access_token: this.jwt.sign(payload),
    };
  }

  // --- FITUR PROFILE MANAGEMENT (Tinggal Kopas) ---

  async updateUser(id: number, data: any) {
    try {
      const updatePayload: any = { ...data };

      // Proteksi: User tidak boleh ubah role sendiri via endpoint ini
      delete updatePayload.role;

      if (updatePayload.password) {
        updatePayload.password = await bcrypt.hash(updatePayload.password, 10);
      }

      if (updatePayload.studentId) {
        updatePayload.studentId = Number(updatePayload.studentId);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: Number(id) },
        data: updatePayload,
      });

      return {
        message: 'Profil berhasil diperbarui',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          role: updatedUser.role,
        },
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Gagal memperbarui profil. Pastikan data benar.');
    }
  }

  async deleteUser(id: number) {
    try {
      await this.prisma.user.delete({
        where: { id: Number(id) },
      });
      return { message: 'Akun berhasil dihapus' };
    } catch (error) {
      throw new BadRequestException('Gagal menghapus akun, user mungkin sudah tidak ada');
    }
  }
}