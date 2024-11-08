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
