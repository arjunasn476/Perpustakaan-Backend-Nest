import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBorrowingDto {
  @IsNotEmpty({ message: 'studentId tidak boleh kosong' })
  @IsNumber({}, { message: 'studentId harus berupa angka' })
  studentId: number;

  @IsNotEmpty({ message: 'bookId tidak boleh kosong' })
  @IsNumber({}, { message: 'bookId harus berupa angka' })
  bookId: number;
}