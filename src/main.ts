import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder()
    .setTitle('Image Management API with Cloudinary')
    .setDescription('This application is an Image Management system that allows users to store and manage their images efficiently. Images are uploaded to the cloud through integration with the Cloudinary service, ensuring secure and accessible storage. The system includes authentication functionality, allowing each user to create an account and have exclusive control over the management of their own images.')
    .setVersion('1.0')
    .addTag('image-management-api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  await app.init()
}
bootstrap();
