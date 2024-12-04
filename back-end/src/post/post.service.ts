import {
  BadRequestException,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { MutationPostDto } from './dto/create-post.dto';
import { createReadStream, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(
    mutationPostDto: MutationPostDto,
    file: Express.Multer.File,
    req: Request,
  ) {
    try {
      const imgUrl = file
        ? `/assets/${new Date().getTime()}${file.originalname}`
        : null;
      await this.prisma.post.create({
        data: {
          title: mutationPostDto.title,
          content: mutationPostDto.content,
          authorId: (req.user as any)?.id,
          published: mutationPostDto.published === 'true' ? true : false,
          ...(file && {
            imgUrl,
          }),
        },
      });
      if (file) {
        writeFileSync(join(process.cwd(), imgUrl), file.buffer);
      }
      return 'This action adds a new post';
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async getImage(imageUrl: string) {
    try {
      const file = createReadStream(join(process.cwd(), `/assets/${imageUrl}`));
      return new StreamableFile(file, {
        type: 'image/*',
        disposition: `attachment; filename="${imageUrl}"`,
        // If you want to define the Content-Length value to another value instead of file's length:
        // length: 123,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async findAllMyPost(req: Request) {
    try {
      return await this.prisma.post.findMany({
        where: {
          authorId: (req.user as any)?.id,
        },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async findAllPost() {
    try {
      return await this.prisma.post.findMany({
        where: {
          published: true,
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async update(
    id: number,
    mutationPostDto: MutationPostDto,
    file: Express.Multer.File,
    req: Request,
  ) {
    try {
      const imgUrl = file
        ? `/assets/${new Date().getTime()}${file.originalname}`
        : null;
      const data = await this.prisma.post.update({
        where: {
          id,
          authorId: (req.user as any)?.id,
        },
        data: {
          title: mutationPostDto.title,
          content: mutationPostDto.content,
          authorId: (req.user as any)?.id,
          published: mutationPostDto.published === 'true' ? true : false,
          ...(file && {
            imgUrl,
          }),
        },
      });
      if (file) {
        writeFileSync(join(process.cwd(), imgUrl), file.buffer);
      }
      if (data.imgUrl && file) {
        setTimeout(() => {
          unlinkSync(join(process.cwd(), `${mutationPostDto.oldImgUrl}`));
        }, 200);
      }
      return 'success update post';
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.post.delete({
        where: {
          id,
        },
      });
      if (data.imgUrl) {
        unlinkSync(join(process.cwd(), data.imgUrl));
      }
      return 'delete success';
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
