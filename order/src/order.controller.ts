import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAllOrders() {
    return this.orderService.findAll();
  }

  @Post()
  async createOrder(
    @Body('item') item: string,
    @Body('quantity') quantity: number,
    @Body('price') price: number,
    @Body('userId') userId: number,
  ) {
    return this.orderService.createOrder(item, quantity, price, userId);
  }
}