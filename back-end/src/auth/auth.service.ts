import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async login(body: LoginDto) {
    try {
      const userData = await this.prisma.user.findFirst({
        where: {
          email: body.email,
        },
      });
      if (!userData) throw 'Error login credential!';

      const isMatch = await bcrypt.compare(body.password, userData.password);
      if (!isMatch) throw 'Error login credential!';
      const payload = {
        email: userData.email,
        sub: userData.id,
        name: userData.name,
      };
      return {
        access_token: this.jwtService.sign(payload, {
          secret: process.env.SECRET_TOKEN,
          expiresIn: 3600 * 24,
        }),
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async register(body: RegisterDto) {
    try {
      const userData = await this.prisma.user.findFirst({
        where: {
          email: body.email,
        },
      });
      if (userData) throw 'Email already exist!';
      const result = await this.prisma.$transaction(async (ctx) => {
        const hash = await bcrypt.hash(body.password, 10);

        const registerUser = await ctx.user.create({
          data: {
            email: body.email,
            password: hash,
            name: body.name,
          },
        });
        const payload = {
          email: registerUser.email,
          sub: registerUser.id,
          name: registerUser.name,
        };
        return { payload };
      });
      return {
        access_token: this.jwtService.sign(result.payload, {
          secret: process.env.SECRET_TOKEN,
          expiresIn: 3600 * 24,
        }),
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
