import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001, // Adjust the port based on your microservice setup
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3002, // Adjust the port based on your microservice setup
    },
  });

  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe()); // Enable global validation
  console.log(3000);
  await app.listen(3000);
}
bootstrap();
