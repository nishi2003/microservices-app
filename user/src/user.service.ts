// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class UserService {
//   getUsers() {
//     return [
//       { id: 1, name: 'John Doe' },
//       { id: 2, name: 'Adam smith' },
//     ];
//   }
// }
// ----------------------
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './entities/user.entity';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   findAll(): Promise<User[]> {
//     return this.userRepository.find();
//   }

//   findOne(id: number): Promise<User> {
//     return this.userRepository.findOne({ where: { id } });
//   }

//   create(user: User): Promise<User> {
//     return this.userRepository.save(user);
//   }

//   async update(id: number, user: Partial<User>): Promise<void> {
//     await this.userRepository.update(id, user);
//   }

//   async remove(id: number): Promise<void> {
//     await this.userRepository.delete(id);
//   }
// }


// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/src/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // // Fetch all users with their orders
  // async findAll(): Promise<User[]> {
  //   return this.userRepository.find({ relations: ['orders'] });
  // }

  // // Fetch a user by ID with their orders
  // async findById(id: number): Promise<User> {
  //   return this.userRepository.findOne({
  //     where: { id },
  //     relations: ['orders'],
  //   });
  // }

  async createUser(name: string, email: string): Promise<User> {
    const user = this.userRepository.create({ name, email });
    return this.userRepository.save(user);
  }
  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['orders'] });
  }
  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}
