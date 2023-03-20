import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(11, {
    message: 'Имя должно быть не более 11 символов',
  })
  name: string;

  @IsString()
  @MaxLength(30, {
    message: 'Пароль не должен превышать 30 символов',
  })
  @MinLength(5, {
    message: 'Пароль должен быть не менее 5 символов',
  })
  password: string;
}
