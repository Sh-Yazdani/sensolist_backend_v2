import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

const urlPrefix = "api"

function initializeSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Sensolist REST-API documentaion")
    .setDescription("in case of any confusion feel free for asking")
    .setVersion("2")
    .addBearerAuth({ type: 'http', description: "insert the access token", scheme: "bearer", bearerFormat: "JWT" }, "access_token")
    .build()

  const documentation = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(`${urlPrefix}/:version/docs`, app, documentation, {
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ]
  })
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '2' })
    .setGlobalPrefix(urlPrefix)

  app.enableCors({
    origin: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    methods: ['OPTIONS', 'GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
    preflightContinue: false
  })

  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      console.debug("option is handled")
      res.sendStatus(200);
    } else {
      next();
    }
  });

  initializeSwagger(app)

  await app.listen(3000, () => {
    console.log("server listen on port 3000, docs url: ~/docs")
  });
}
bootstrap();


