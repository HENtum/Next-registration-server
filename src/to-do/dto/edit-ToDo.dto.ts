import { IsOptional, IsString } from 'class-validator';

export class editToDoDto {
  id: number;

  @IsOptional()
  @IsString({ message: 'Название не может быть цифрой' })
  title: string;

  @IsOptional()
  @IsString()
  toDo: string;
}
