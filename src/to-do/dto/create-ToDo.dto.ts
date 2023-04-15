import { IsString } from 'class-validator';

export class createToDoDto {
  @IsString()
  title: string;

  @IsString()
  toDo: string;
}
