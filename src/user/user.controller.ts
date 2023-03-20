import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseInterceptors,
  UploadedFile,
  Patch,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginTap2 } from './dto/login-tap2.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Auth } from './auth.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/create')
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
  @HttpCode(200)
  @Post('/login')
  loginTap1(@Body('email') email: string) {
    return this.userService.loginTap1(email);
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/login/password')
  loginTap2(@Body() dto: LoginTap2) {
    return this.userService.loginTap2(dto);
  }
  @Auth()
  @Get()
  validUser(@Request() req: { user: {} }) {
    return req.user;
  }
  @HttpCode(200)
  @Auth()
  @Post('/refresh')
  newToken(@Body('refreshToken') refreshToken: string) {
    return this.userService.getNewTokens(refreshToken);
  }
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (_, file, cb) => {
          const newFileName = file.originalname;
          cb(null, newFileName);
        },
      }),
      fileFilter: (_, file, cb) => {
        if (!file?.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
          return cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  @Auth()
  @Patch('/editAvatar')
  editUserAvatar(
    @UploadedFile()
    file: Express.Multer.File,
    @Request() req: { user: { user: { id: number } } },
  ) {
    return this.userService.editUserAvatar(file.originalname, req.user);
  }
  @UsePipes(new ValidationPipe())
  @Auth()
  @Patch('/edit')
  editUser(
    @Request() req: { user: { user: { id: number } } },
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.editUser(dto, req.user);
  }
  @Auth()
  @Patch('/edit/password')
  editPassword(
    @Body('password') password: string,
    @Request() req: { user: { user: { id: number } } },
  ) {
    return this.userService.editPassword(password, req.user);
  }
}
