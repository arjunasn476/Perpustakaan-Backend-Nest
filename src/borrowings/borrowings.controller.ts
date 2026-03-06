import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { BorrowingsService } from './borrowings.service';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Borrowings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('borrowings')
export class BorrowingsController {
  constructor(private readonly borrowingsService: BorrowingsService) {}

  @Post()
  @ApiOperation({ summary: 'Melakukan peminjaman buku baru' })
  create(@Body() dto: CreateBorrowingDto) {
    return this.borrowingsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Melihat riwayat peminjaman dengan filter' })
  findAll(
    @Query('studentId') studentId?: string,
    @Query('bookId') bookId?: string,
    @Query('status') status?: 'BORROWED' | 'RETURNED',
    @Query('studentName') studentName?: string,
  ) {
    return this.borrowingsService.findAll({
      studentId: studentId ? Number(studentId) : undefined,
      bookId: bookId ? Number(bookId) : undefined,
      status,
      studentName,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Melihat detail satu transaksi peminjaman' })
  findOne(@Param('id') id: string) {
    return this.borrowingsService.findOne(Number(id));
  }

  @Patch(':id/return')
  @ApiOperation({ summary: 'Melakukan pengembalian buku' })
  returnBook(@Param('id') id: string) {
    return this.borrowingsService.returnBook(Number(id));
  }
}