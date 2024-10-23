import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../order/src/entities/order.entity';
import { User } from '../../user/src/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    // private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createOrder(
    item: string,
    quantity: number,
    price: number,
    userId: number,
  ): Promise<Order> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const order = this.orderRepository.create({ item, quantity, price, user });
    return this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['user'] }); // Load related user
  }

  async findOrdersByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } }, // Reference the user relation directly
      relations: ['user'], // Ensure user relation is loaded
    });
  }
}
