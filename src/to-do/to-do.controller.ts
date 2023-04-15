import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
  Request,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { ToDoService } from './to-do.service';
import { Auth } from 'src/user/auth.decorator';
import { createToDoDto } from './dto/create-ToDo.dto';
import { editToDoDto } from './dto/edit-ToDo.dto';

@Controller('toDo')
export class ToDoController {
  constructor(private readonly toDoService: ToDoService) {}

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Auth()
  @Post('/create')
  createToDo(
    @Body() dto: createToDoDto,
    @Request() req: { user: { user: { id: number } } },
  ) {
    return this.toDoService.create(dto, req.user);
  }

  @Auth()
  @Get()
  findForUser(@Request() req: { user: { user: { id: number } } }) {
    return this.toDoService.getForUser(req.user);
  }

  @Auth()
  @Patch('/edit')
  editToDo(
    @Body() dto: editToDoDto,
    @Request() req: { user: { user: { id: number } } },
  ) {
    return this.toDoService.edit(dto, req.user);
  }

  @Auth()
  @Delete('/remove')
  removeToDo(@Body('id') id: string) {
    return this.toDoService.delete(id);
  }
}
