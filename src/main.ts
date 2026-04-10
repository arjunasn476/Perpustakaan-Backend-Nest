import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Tambah ini untuk izinkan request dari frontend

  // Pakai ValidationPipe yang lama (jangan dihapus)
  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true,
      transform: true, 
      transformOptions: { enableImplicitConversion: true } 
    })
  );

  // Konfigurasi Swagger sesuai Modul 7
  const config = new DocumentBuilder()
    .setTitle('Library API')
    .setDescription('Backend API Sistem Perpustakaan')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();