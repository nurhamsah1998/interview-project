import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(user_id: number): Promise<User | undefined> {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id: user_id,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
