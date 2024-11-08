import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import { lastValueFrom } from 'rxjs';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, 'usersConnection')
    private readonly userRepository: Repository<User>,

    @Inject('ORDER_SERVICE')
    private readonly orderServiceClient: ClientProxy, // Injecting the TCP client
  ) {}

  async createUser(createUserDto: any): Promise<any> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: any) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the user fields
    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async deleteUser(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  async getUsers(): Promise<any[]> {
    const users = await this.userRepository.find();

    // For each user, try to fetch their orders
    const usersWithOrders = await Promise.all(
      users.map(async (user) => {
        try {
          const orders = await lastValueFrom(
            this.orderServiceClient.send(
              { cmd: 'get_orders_by_user' },
              { userId: user.id },
            ),
          );
          return { ...user, orders }; // Include orders in the response
        } catch (error) {
          console.error('Error fetching orders for user:', user.id, error);
          return { ...user, orders: [] }; // Return user without orders if the service is down
        }
      }),
    );

    return usersWithOrders;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Request orders from the Order service
    let orders;
    try {
      orders = await lastValueFrom(
        this.orderServiceClient.send(
          { cmd: 'get_orders_by_user' },
          { userId: id },
        ),
      );
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new HttpException(
        'Could not fetch orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      ...user,
      orders, // Include orders in the response
    };
  }
}
