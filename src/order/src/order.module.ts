// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Order } from './entities/order.entity';
// import { OrderService } from './order.service';
// import { OrderController } from './order.controller';
// import { User } from '../../user/src/entities/user.entity';

// @Module({
//   imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Order, User])],
//   controllers: [OrderController],
//   providers: [OrderService],
// })
// export class OrderModule {}

// src/order/order.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DatabaseModule } from '../../database/database.module'; // Import shared DB module

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Order], 'ordersConnection'),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
