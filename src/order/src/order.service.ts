import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order, 'ordersConnection')
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getOrders() {
    return await this.orderRepository.find();
  }

  async getOrdersByUser(userId: number) {
    return await this.orderRepository.find({ where: { userId } });
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Update the order fields
    Object.assign(order, updateOrderDto);

    return this.orderRepository.save(order);
  }

  async deleteOrder(id: number) {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Order not found');
    }
    return { message: 'Order deleted successfully' };
  }
}
