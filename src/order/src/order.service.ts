// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Order } from './entities/order.entity';
// import { User } from '../../user/src/entities/user.entity';

// @Injectable()
// export class OrderService {
//   constructor(
//     @InjectRepository(Order)
//     private orderRepository: Repository<Order>,
//     // private orderRepository: Repository<Order>,
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//   ) {}

//   async createOrder(
//     item: string,
//     quantity: number,
//     price: number,
//     userId: number,
//   ): Promise<Order> {
//     const user = await this.userRepository.findOne({ where: { id: userId } });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     const order = this.orderRepository.create({ item, quantity, price, user });
//     return this.orderRepository.save(order);
//   }

//   async findAll(): Promise<Order[]> {
//     return this.orderRepository.find({ relations: ['user'] }); // Load related user
//   }

//   async findOrdersByUser(userId: number): Promise<Order[]> {
//     return this.orderRepository.find({
//       where: { user: { id: userId } }, // Reference the user relation directly
//       relations: ['user'], // Ensure user relation is loaded
//     });
//   }
// }

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
