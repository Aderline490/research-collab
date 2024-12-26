import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  const logger = new Logger('Bootstrap');
  logger.log(`Application is running on: http://localhost:${PORT}`);
}
bootstrap();
