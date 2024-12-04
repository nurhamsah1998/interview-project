import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { MutationPostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(
    @Body(new ValidationPipe()) createPostDto: MutationPostDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (file) {
      if (!file.mimetype.includes('image/'))
        throw new BadRequestException('Invalid mimetype');
      if (file.size >= 1500000)
        throw new BadRequestException('File image must be under 1.5 mb');
    }
    return await this.postService.create(createPostDto, file, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my-post')
  findAll(@Request() req) {
    return this.postService.findAllMyPost(req);
  }

  @Get('/assets/:url_img')
  async getImage(@Param('url_img') url_img) {
    return await this.postService.getImage(url_img);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllPost() {
    return this.postService.findAllPost();
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new ValidationPipe()) mutationPostDto: MutationPostDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (file) {
      if (!file.mimetype.includes('image/'))
        throw new BadRequestException('Invalid mimetype');
      if (file.size >= 1500000)
        throw new BadRequestException('File image must be under 1.5 mb');
    }
    return await this.postService.update(id, mutationPostDto, file, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
