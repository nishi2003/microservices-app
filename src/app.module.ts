import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClientProxy } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3001 },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3002 },
      },
    ]),
    DatabaseModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
