import { Module } from '@nestjs/common';
import { BorrowingsService } from './borrowings.service';
import { BorrowingsController } from './borrowings.controller';

@Module({
  providers: [BorrowingsService],
  controllers: [BorrowingsController]
})
export class BorrowingsModule {}
