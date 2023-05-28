import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('token'),
      ignoreExpiration: true,
      secretOrKey: configService.get("JWTSECRET"),
    });
  }

  async validate({ id }: Pick<User, 'id'>) {
    const userSend = await this.prisma.user.findUnique({
      where: {
        id: +id,
      },
    });
    if (userSend) {
      const { password, ...user } = userSend;
      return {
        user,
      };
    }
  }
}
