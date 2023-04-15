import { Module } from '@nestjs/common';
import { ToDoService } from './to-do.service';
import { ToDoController } from './to-do.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ToDoController],
  providers: [ToDoService, PrismaService],
})
export class ToDoModule {}
