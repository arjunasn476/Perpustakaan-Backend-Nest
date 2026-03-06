import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty({ message: 'NIS tidak boleh kosong' })
  @IsString()
  nis: string;

  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Format email tidak valid' })
  email?: string;

  @IsNotEmpty({ message: 'Kelas tidak boleh kosong' })
  @IsString()
  kelas: string;

  @IsNotEmpty({ message: 'Jurusan tidak boleh kosong' })
  @IsString()
  jurusan: string;
}