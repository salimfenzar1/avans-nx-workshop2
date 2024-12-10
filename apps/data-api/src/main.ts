/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
    AllExceptionsFilter,
    HttpExceptionFilter,
    ApiResponseInterceptor
} from '@avans-nx-workshop/backend/dto';
import { AppModule } from './app/app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

   const CorsOptions : CorsOptions = {};
   app.enableCors(CorsOptions);


    app.useGlobalInterceptors(new ApiResponseInterceptor());

    app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          exceptionFactory: (errors) => {
            const validationErrors = errors.map((err) => ({
              field: err.property,
              errors: Object.values(err.constraints || {}),
            }));
            return new BadRequestException({
              message: 'Validation failed',
              errors: validationErrors,
            });
          },
        }),
      );

      const config = new DocumentBuilder()
      .setTitle('Data API')
      .setDescription('API voor receptenbeheer')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${globalPrefix}/docs`, app, document);
  
    const port = process.env.PORT || 3000;
    await app.listen(port);
    Logger.log(
        `🚀 DATA-API server is running on: http://localhost:${port}/${globalPrefix}`
    );
    Logger.log(
        `📄 Swagger docs beschikbaar op: http://localhost:${port}/${globalPrefix}/docs`
      );
}

bootstrap();
