import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Menambah data siswa baru (Admin Only)' })
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'PETUGAS')
  @ApiOperation({ summary: 'Melihat daftar seluruh siswa' })
  find(@Query('id') id?: string, @Query('nis') nis?: string, @Query('name') name?: string) {
    return this.studentsService.findFlexible({ id, nis, name });
  }

  @Get(':id')
  @Roles('ADMIN', 'PETUGAS')
  @ApiOperation({ summary: 'Melihat detail siswa berdasarkan ID' })
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(Number(id));
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Mengubah data siswa (Admin Only)' })
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(Number(id), dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Menghapus data siswa (Admin Only)' })
  remove(@Param('id') id: string) {
    return this.studentsService.remove(Number(id));
  }
}