// import { Controller, Get, Post, Body } from '@nestjs/common';
// import { OrderService } from './order.service';

// @Controller('orders')
// export class OrderController {
//   constructor(private readonly orderService: OrderService) {}

//   @Get()
//   async getAllOrders() {
//     return this.orderService.findAll();
//   }

//   @Post()
//   async createOrder(
//     @Body('item') item: string,
//     @Body('quantity') quantity: number,
//     @Body('price') price: number,
//     @Body('userId') userId: number,
//   ) {
//     return this.orderService.createOrder(item, quantity, price, userId);
//   }
// }

import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({ cmd: 'get_orders_by_user' })
  @ApiOperation({ summary: 'Get orders by user ID' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiBadRequestResponse({ description: 'User not found or has no orders' })
  async getOrdersByUser(@Payload() data: { userId: number }) {
    return await this.orderService.getOrdersByUser(data.userId);
  }

  // Handler to get all orders
  @MessagePattern({ cmd: 'get_orders' })
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: [Order],
  })
  async getOrders() {
    return await this.orderService.getOrders();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: Order,
  })
  @ApiBadRequestResponse({ description: 'Invalid order data' })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(createOrderDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an order by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the order to update',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
    type: Order,
  })
  @ApiBadRequestResponse({ description: 'Order not found' })
  async updateOrder(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the order to delete',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiBadRequestResponse({ description: 'Order not found' })
  async deleteOrder(@Param('id') id: number) {
    console.log(this.deleteOrder);
    return this.orderService.deleteOrder(id);
  }
}
