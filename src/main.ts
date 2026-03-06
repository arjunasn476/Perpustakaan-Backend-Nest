import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Tambah ini [cite: 32]

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pakai ValidationPipe yang lama (jangan dihapus)
  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true,
      transform: true, 
      transformOptions: { enableImplicitConversion: true } 
    })
  );

  // Konfigurasi Swagger sesuai Modul 7 [cite: 38, 39, 40, 41, 42]
  const config = new DocumentBuilder()
    .setTitle('Library API')
    .setDescription('Backend API Sistem Perpustakaan')
    .setVersion('1.0')
    .addBearerAuth() // Penting untuk JWT [cite: 42, 51]
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Akses di /api [cite: 45, 52, 53]

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();