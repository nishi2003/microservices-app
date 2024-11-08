import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({ cmd: 'get_orders_by_user' })
  async getOrdersByUser(@Payload() data: { userId: number }) {
    return await this.orderService.getOrdersByUser(data.userId);
  }

  // Handler to get all orders
  @MessagePattern({ cmd: 'get_orders' })
  async getOrders() {
    return await this.orderService.getOrders();
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(createOrderDto);
  }

  @Put(':id')
  async updateOrder(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: number) {
    console.log(this.deleteOrder);
    return this.orderService.deleteOrder(id);
  }
}
