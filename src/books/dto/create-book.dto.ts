import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator'; // Tambah ini

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString() // 👈 Tambah ini agar lolos whitelist
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString() // 👈 Tambah ini agar lolos whitelist
  author: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber() // 👈 Tambah ini agar lolos whitelist
  year: number;
}