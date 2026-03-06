import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  // PERBAIKAN: Memetakan data satu per satu agar tidak "missing" di Prisma
  async create(dto: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        title: dto.title,
        author: dto.author,
        year: Number(dto.year), // Pastikan menjadi tipe number agar tidak error 500
      },
    });
  }

  async findAll() {
    return this.prisma.book.findMany();
  }

  async findFlexible(params: { id?: string; title?: string }) {
    const { id, title } = params;

    if (id) {
      const book = await this.prisma.book.findUnique({
        where: { id: Number(id) },
      });
      if (!book) throw new NotFoundException(`Buku dengan ID ${id} tidak ditemukan`);
      return book;
    }

    if (title) {
      return this.prisma.book.findMany({
        where: { title: { contains: title } },
      });
    }

    return this.findAll();
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Buku dengan ID ${id} tidak ditemukan`);
    }

    return book;
  }

  // PERBAIKAN: Menangani update dengan konversi tipe data yang aman
  async update(id: number, dto: UpdateBookDto) {
    // Cek dulu apakah buku ada
    await this.findOne(id);

    return this.prisma.book.update({
      where: { id },
      data: {
        title: dto.title,
        author: dto.author,
        year: dto.year ? Number(dto.year) : undefined,
      },
    });
  }

  async remove(id: number) {
    // Cek dulu apakah buku ada
    await this.findOne(id);

    // 1. Hapus dulu riwayat peminjaman (menghindari error P2003 / Foreign Key Constraint)
    await this.prisma.borrowing.deleteMany({
      where: { bookId: id },
    });

    // 2. Baru hapus bukunya
    return this.prisma.book.delete({
      where: { id },
    });
  }
}