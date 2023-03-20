import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { LoginTap2 } from './dto/login-tap2.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  async create(dto: CreateUserDto) {
    try {
      const isEmail = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (isEmail) {
        return {
          message: 'Пользователь с такой почтой уже существует',
        };
      }
      const isUsername = await this.prisma.user.findUnique({
        where: {
          name: dto.name,
        },
      });
      if (isUsername) {
        return {
          message: 'Похоже, что это имя уже занято',
        };
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(dto.password, salt);
      const createUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hash,
          avatar: null,
        },
      });

      if (createUser) {
        const { password, ...user } = createUser;
        return {
          user,
          token: await this.issueTokens(createUser.id),
        };
      }
    } catch (error) {
      return {
        error,
        message: 'Не удалось зарегестрироватся',
      };
    }
  }
  async loginTap1(email: string) {
    try {
      const isEmail = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!isEmail) {
        return {
          message: 'Аккаунт не найден',
        };
      }

      if (isEmail) {
        const { password, ...user } = isEmail;
        return {
          user,
        };
      }
    } catch (error) {
      return {
        message: 'Возникла ошибка',
      };
    }
  }
  async loginTap2(dto: LoginTap2) {
    try {
      const isEmail = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (isEmail) {
        const validPassword = await bcrypt.compare(
          dto.password,
          isEmail.password,
        );
        const { password, ...user } = isEmail;
        if (!validPassword) {
          return {
            message: 'Не верный пароль',
          };
        }
        if (validPassword) {
          return {
            user,
            token: await this.issueTokens(isEmail.id),
          };
        }
      } else {
        return {
          message: 'Aккаунт не найден',
        };
      }
    } catch (error) {
      return {
        error,
        message: 'Возникла ошибка',
      };
    }
  }

  async editUserAvatar(filename: string, userar: { user: { id: number } }) {
    try {
      const editUserAvatar = await this.prisma.user.update({
        where: {
          id: userar.user.id,
        },
        data: {
          avatar: filename,
        },
      });
      if (editUserAvatar) {
        const { password, ...user } = editUserAvatar;
        return {
          user,
        };
      }
    } catch (error) {
      return {
        message: 'Возникла ошибка',
      };
    }
  }
  async editUser(dto: UpdateUserDto, userar: { user: { id: number } }) {
    try {
      const isUser = await this.prisma.user.findUnique({
        where: {
          id: userar.user.id,
        },
      });
      if (!isUser) {
        return {
          message: 'Ошибка обновления',
        };
      }
      const editUser = await this.prisma.user.update({
        where: {
          id: userar.user.id,
        },
        data: {
          email: dto.email,
          name: dto.name,
        },
      });
      if (editUser) {
        const { password, ...user } = editUser;
        return {
          user,
        };
      }
    } catch (error) {
      return {
        error,
        message: 'Ошибка обновления',
      };
    }
  }
  async editPassword(password: string, userar: { user: { id: number } }) {
    try {
      const isUser = await this.prisma.user.findUnique({
        where: {
          id: userar.user.id,
        },
      });
      if (!isUser) {
        return {
          message: 'Пользователь не найден',
        };
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const passwordSend = await this.prisma.user.update({
        where: {
          id: userar.user.id,
        },
        data: {
          password: hash,
        },
      });
      if (passwordSend) {
        return {
          message: 'Успешно',
        };
      }
    } catch (error) {
      return {
        error,
        message: 'Не удалось обновить пароль',
      };
    }
  }
  async getNewTokens(refreshToken: string) {
    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) {
      return {
        message: 'Вы не зарегестрированны',
      };
    }
    const userSend = await this.prisma.user.findUnique({
      where: {
        id: result.id,
      },
    });
    const tokens = await this.issueTokens(userSend.id);
    const { password, ...user } = userSend;
    return {
      user,
      ...tokens,
    };
  }
  private async issueTokens(userId: number) {
    const data = { id: userId };
    const accessToken = this.jwtService.sign(data, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(data, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
}
