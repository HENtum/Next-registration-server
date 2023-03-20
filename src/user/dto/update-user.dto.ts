import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsString, MaxLength } from 'class-validator';
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(11, {
    message: 'Имя должно быть не более 11 символов',
  })
  name: string;
}
