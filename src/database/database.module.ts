import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../order/src/entities/order.entity';
import { ExampleEntity } from 'src/entities/example.entity';
import { User } from '../../user/src/entities/user.entity';
// import dotenv from 'dotenv';

// dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nest_db',
      // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      entities: [ExampleEntity, User, Order],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class DatabaseModule {}
