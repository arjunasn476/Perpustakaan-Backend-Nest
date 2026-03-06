import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Tambah ini [cite: 135]
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { BooksModule } from './books/books.module';
import { BorrowingsModule } from './borrowings/borrowings.module';

@Module({
  imports: [
    // Tambahkan ini di urutan paling atas imports [cite: 138, 139, 140, 141, 142, 143, 144]
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),
    PrismaModule,
    AuthModule,
    StudentsModule,
    BooksModule,
    BorrowingsModule,
  ],
})
export class AppModule {}