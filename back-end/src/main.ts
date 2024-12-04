import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.CORS_ORIGIN });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT, () =>
    console.log(`SERVER RUNNING (http://localhost:${process.env.PORT})`),
  );
}
bootstrap();
