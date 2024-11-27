// // import { Injectable } from '@nestjs/common';
// // import { InjectRepository } from '@nestjs/typeorm';
// // import { Repository } from 'typeorm';
// // import { User } from '../../user/src/entities/user.entity';

// // @Injectable()
// // export class UserService {
// //   constructor(
// //     @InjectRepository(User)
// //     private readonly userRepository: Repository<User>,
// //   ) {}

// //   // // Fetch all users with their orders
// //   // async findAll(): Promise<User[]> {
// //   //   return this.userRepository.find({ relations: ['orders'] });
// //   // }

// //   // // Fetch a user by ID with their orders
// //   // async findById(id: number): Promise<User> {
// //   //   return this.userRepository.findOne({
// //   //     where: { id },
// //   //     relations: ['orders'],
// //   //   });
// //   // }

// //   async createUser(name: string, email: string): Promise<User> {
// //     const user = this.userRepository.create({ name, email });
// //     return this.userRepository.save(user);
// //   }
// //   async findAll(): Promise<User[]> {
// //     return this.userRepository.find({ relations: ['orders'] });
// //   }
// //   async findById(id: number): Promise<User> {
// //     return this.userRepository.findOne({ where: { id } });

// //   }
// // }

// import { Injectable, Inject } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './entities/user.entity';
// import { ClientProxy } from '@nestjs/microservices';
// import { lastValueFrom } from 'rxjs';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,

//     @Inject('ORDER_SERVICE') private readonly orderServiceClient: ClientProxy,
//   ) {}
//   // Method to create a new user
//   async createUser(name: string, email: string): Promise<User> {
//     const newUser = this.userRepository.create({ name, email });
//     return this.userRepository.save(newUser);
//   }

//   // Method to get all users
//   findAll(): Promise<User[]> {
//     return this.userRepository.find();
//   }
//   // Method to find a user with their orders
//   async findUserWithOrders(userId: number): Promise<any> {
//     const user = await this.userRepository.findOne({ where: { id: userId } });
//     if (!user) {
//       throw new Error('User not found');
//     }

//     // Call the Order Service to fetch the orders
//     const orders$ = this.orderServiceClient.send(
//       { cmd: 'get_orders_by_user' },
//       { userId },
//     );
//     const orders = await lastValueFrom(orders$);

//     return { ...user, orders };
//   }

//   // Example of a method to get all users
//   // findAll(): Promise<User[]> {
//   //   return this.userRepository.find();
//   // }
// }

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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, 'ordersConnection')
    private readonly userRepository: Repository<User>,

    @Inject('ORDER_SERVICE')
    private readonly orderServiceClient: ClientProxy, // Injecting the TCP client
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
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

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './entities/user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   async getUsers() {
//     return this.userRepository.find({ relations: ['orders'] }); // Fetch users with orders
//   }

//   async getUserById(id: number) {
//     const user = await this.userRepository.findOne({
//       where: { id },
//       relations: ['orders'], // Include orders in the response
//     });

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     return user;
//   }

//   async createUser(createUserDto: CreateUserDto): Promise<User> {
//     const newUser = this.userRepository.create(createUserDto);
//     return this.userRepository.save(newUser);
//   }

//   async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
//     const user = await this.userRepository.preload({ id, ...updateUserDto });

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     return this.userRepository.save(user);
//   }

//   async deleteUser(id: number) {
//     const result = await this.userRepository.delete(id);

//     if (result.affected === 0) {
//       throw new NotFoundException('User not found');
//     }

//     return { message: 'User deleted successfully' };
//   }
// }
