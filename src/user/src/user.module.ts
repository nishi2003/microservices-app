import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [
    ClientsModule.register([
      //     {
      //       name: 'USER_SERVICE',
      //       transport: Transport.TCP,
      //       options: { host: '127.0.0.1', port: 3001 },
      //     },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3002 },
      },
    ]),
    DatabaseModule,
    TypeOrmModule.forFeature([User], 'usersConnection'),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
