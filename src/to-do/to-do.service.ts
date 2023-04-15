import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createToDoDto } from './dto/create-ToDo.dto';
import { editToDoDto } from './dto/edit-ToDo.dto';

@Injectable()
export class ToDoService {
  constructor(private prisma: PrismaService) {}
  async getForUser(user: { user: { id: number } }) {
    try {
      return this.prisma.toDo.findMany({
        where: {
          authorId: user.user.id,
        },
      });
    } catch (error) {
      new HttpException('message', HttpStatus.BAD_REQUEST);
      return error;
    }
  }

  async create(dto: createToDoDto, user: { user: { id: number } }) {
    try {
      const checkTitle = await this.prisma.toDo.findMany({
        where: {
          authorId: user.user.id,
        },
      });
      const isTitle = checkTitle.some((obj) => obj.title === dto.title);
      if (isTitle) {
        return { message: 'Такое название уже существует' };
      } else {
        return this.prisma.toDo.create({
          data: {
            title: dto.title,
            toDo: dto.toDo,
            authorId: +user.user.id,
          },
        });
      }
    } catch (error) {
      new HttpException('message', HttpStatus.BAD_REQUEST);
      return error;
    }
  }

  async edit(dto: editToDoDto, user: { user: { id: number } }) {
    try {
      const checkTitle = await this.prisma.toDo.findMany({
        where: {
          authorId: user.user.id,
        },
      });
      const isTitle = checkTitle.some((obj) => obj.title === dto.title);

      if (isTitle) {
        return {
          message: 'Такое название уже существует',
        };
      } else {
        return this.prisma.toDo.update({
          where: {
            id: +dto.id,
          },
          data: {
            title: dto.title,
            toDo: dto.toDo,
            authorId: user.user.id,
          },
        });
      }
    } catch (error) {
      new HttpException('message', HttpStatus.BAD_REQUEST);
      return error;
    }
  }

  async delete(id: string) {
    try {
      return this.prisma.toDo.delete({
        where: {
          id: +id,
        },
      });
    } catch (error) {
      new HttpException('message', HttpStatus.NOT_FOUND);
      return error;
    }
  }
}
