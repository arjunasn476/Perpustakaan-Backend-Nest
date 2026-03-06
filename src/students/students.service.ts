import { 
  BadRequestException, 
  Injectable, 
  NotFoundException, 
  ConflictException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    // 1. Pre-validation: Cek manual sebelum MySQL booking ID
    const existing = await this.prisma.student.findFirst({
      where: {
        OR: [
          { nis: dto.nis },
          { email: dto.email ? dto.email : undefined }
        ],
      },
    });

    if (existing) {
      if (existing.nis === dto.nis) {
        throw new ConflictException('NIS sudah terdaftar');
      }
      if (dto.email && existing.email === dto.email) {
        throw new ConflictException('Email sudah terdaftar');
      }
    }

    // 2. Jika lolos, baru create
    return await this.prisma.student.create({ data: dto });
  }

  async findAll() {
    return this.prisma.student.findMany();
  }

  async findFlexible(params: {
    id?: string;
    nis?: string;
    name?: string;
  }) {
    const { id, nis, name } = params;

    if (id) {
      return this.prisma.student.findUnique({
        where: { id: Number(id) },
      });
    }

    if (nis) {
      return this.prisma.student.findUnique({
        where: { nis },
      });
    }

    if (name) {
      return this.prisma.student.findMany({
        where: {
          name: { contains: name },
        },
      });
    }

    return this.findAll();
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) throw new NotFoundException('Student tidak ditemukan');
    return student;
  }

  async update(id: number, dto: UpdateStudentDto) {
    // Cek apakah data yang mau diupdate ada
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student tidak ditemukan');

    // Cek apakah NIS/Email baru sudah dipakai orang lain
    if (dto.nis || dto.email) {
      const conflict = await this.prisma.student.findFirst({
        where: {
          NOT: { id }, // Kecuali diri sendiri
          OR: [
            { nis: dto.nis },
            { email: dto.email ? dto.email : undefined }
          ]
        }
      });
      if (conflict) throw new ConflictException('NIS atau Email sudah digunakan siswa lain');
    }

    return await this.prisma.student.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student tidak ditemukan');

    return this.prisma.student.delete({
      where: { id },
    });
  }
}