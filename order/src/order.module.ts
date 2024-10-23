import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../order/src/entities/order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { User } from '../../user/src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Order, User])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
