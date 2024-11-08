import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
// import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get_users' })
  getUsers() {
    return this.userService.getUsers(); // Fetch all users from the database
  }

  // Handle the message pattern to get a specific user by ID
  @MessagePattern({ cmd: 'get_user_by_id' })
  getUserById(@Payload() data: { id: number }) {
    return this.userService.getUserById(data.id); // Fetch user by ID
  }

  @Post()
  async createUser(@Body() createUserDto: any): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: any,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
