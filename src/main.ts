import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function initializeSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Sensolist REST-API documentaion")
    .setDescription("in case of any confusion feel free for asking")
    .setVersion("1")
    .build()

  const documentation = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, documentation)
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initializeSwagger(app)

  await app.listen(3000, () => {
    console.log("server listen on port 3000, docs url: ~/docs")
  });
}
bootstrap();


