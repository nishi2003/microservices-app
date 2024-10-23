import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../user/src/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  // @Post()
  // async createUser(@Body('name') name: string) {
  //   return this.userService.createUser(name);
  // }
  @Post('create')
  async createUser(@Body() body): Promise<User> {
    const { name, email } = body;
    return this.userService.createUser(name, email);
  }
}