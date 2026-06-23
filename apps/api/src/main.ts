
import helmet from "helmet";
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';


import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

import { NestExpressApplication }
from "@nestjs/platform-express";

import { join }
from "path";



async function bootstrap() {
  const app =
  await NestFactory.create<NestExpressApplication>(
    AppModule
  );
  app.useStaticAssets(
  join(
    process.cwd(),
    "uploads"
  ),
  {
    prefix: "/uploads/",
  }
);

  app.use(helmet());


  // CORS
  app.enableCors({
    origin: "*",
  });

  // EXCEPTION FILTER
  app.useGlobalFilters(new HttpExceptionFilter());

  // RESPONSE INTERCEPTOR
app.useGlobalInterceptors(new ResponseInterceptor());

  // VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // SWAGGER
  const config = new DocumentBuilder()
    .setTitle('AMX ERP API')
    .setDescription('Enterprise AI-Powered Cloud ERP Suite')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
  

  await app.listen(process.env.PORT || 3002);

  console.log(
    `🚀 Backend running on http://localhost:${process.env.PORT || 3002}`
  );

  console.log(
    `📘 Swagger Docs: http://localhost:${process.env.PORT || 3002}/docs`
  );
}

bootstrap();