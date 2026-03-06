import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';

@Injectable()
export class BorrowingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBorrowingDto) {
    // 1. Konversi ke Number dengan aman
    const sId = dto.studentId !== undefined ? Number(dto.studentId) : NaN;
    const bId = dto.bookId !== undefined ? Number(dto.bookId) : NaN;

    // 2. Cek apakah formatnya valid (Input Validation)
    const isSIdInvalid = isNaN(sId);
    const isBIdInvalid = isNaN(bId);

    if (isSIdInvalid && isBIdInvalid) {
      throw new BadRequestException('studentId dan bookId harus diisi dengan angka yang benar');
    }
    if (isSIdInvalid) throw new BadRequestException('studentId harus berupa angka yang valid');
    if (isBIdInvalid) throw new BadRequestException('bookId harus berupa angka yang valid');

    // 3. Cek keberadaan di Database secara paralel
    const [student, book] = await Promise.all([
      this.prisma.student.findUnique({ where: { id: sId } }),
      this.prisma.book.findUnique({ where: { id: bId } }),
    ]);

    // 4. Pesan error spesifik jika data tidak ditemukan (Database Validation)
    if (!student && !book) {
      throw new NotFoundException(`Student ID ${sId} dan Buku ID ${bId} tidak ditemukan`);
    }
    if (!student) throw new NotFoundException(`Student dengan ID ${sId} tidak ditemukan`);
    if (!book) throw new NotFoundException(`Buku dengan ID ${bId} tidak ditemukan`);

    // 5. Cek apakah buku sedang dipinjam
    const activeBorrowing = await this.prisma.borrowing.findFirst({
      where: {
        bookId: bId,
        status: 'BORROWED',
      },
    });

    if (activeBorrowing) {
      throw new BadRequestException('Buku ini sedang dipinjam dan belum dikembalikan');
    }

    // 6. Setup tanggal (7 hari masa pinjam)
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(borrowDate.getDate() + 7);

    // 7. Eksekusi simpan
    return this.prisma.borrowing.create({
      data: {
        studentId: sId,
        bookId: bId,
        status: 'BORROWED',
        borrowDate,
        dueDate,
      },
      include: { student: true, book: true },
    });
  }

  async returnBook(borrowingId: number) {
    const id = Number(borrowingId);
    if (isNaN(id)) throw new BadRequestException('ID peminjaman tidak valid');

    const borrowing = await this.prisma.borrowing.findUnique({
      where: { id: id },
    });

    if (!borrowing) throw new NotFoundException('Data peminjaman tidak ditemukan');
    if (borrowing.status === 'RETURNED') throw new BadRequestException('Buku sudah dikembalikan');

    return this.prisma.borrowing.update({
      where: { id: id },
      data: {
        status: 'RETURNED',
        returnDate: new Date(),
      },
      include: { student: true, book: true },
    });
  }

  async findAll(filter: {
    studentId?: number;
    bookId?: number;
    status?: 'BORROWED' | 'RETURNED';
    studentName?: string;
  }) {
    return this.prisma.borrowing.findMany({
      where: {
        studentId: filter.studentId ? Number(filter.studentId) : undefined,
        bookId: filter.bookId ? Number(filter.bookId) : undefined,
        status: filter.status,
        student: filter.studentName
          ? { name: { contains: filter.studentName } }
          : undefined,
      },
      include: { student: true, book: true },
      orderBy: { borrowDate: 'desc' },
    });
  }

  async findOne(id: number) {
    const bId = Number(id);
    if (isNaN(bId)) throw new NotFoundException('ID tidak valid');

    const borrowing = await this.prisma.borrowing.findUnique({
      where: { id: bId },
      include: { student: true, book: true },
    });

    if (!borrowing) throw new NotFoundException('Data peminjaman tidak ditemukan');
    return borrowing;
  }
}