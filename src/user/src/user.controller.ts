// import { Controller, Get, Post, Body, Param } from '@nestjs/common';
// import { UserService } from './user.service';
// import { User } from './entities/user.entity';

// @Controller('users')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   // @Get()
//   // async getAllUsers() {
//   //   return this.userService.findAll();
//   // }

//   @Get(':id')
//   async getUserWithOrders(@Param('id') id: number) {
//     return this.userService.findUserWithOrders(id);
//   }

//   @Get()
//   async getAllUsers() {
//     return this.userService.findAll();
//   }

//   // @Post()
//   // async createUser(@Body('name') name: string) {
//   //   return this.userService.createUser(name);
//   // }
//   @Post('create')
//   async createUser(@Body() body): Promise<User> {
//     const { name, email } = body;
//     return this.userService.createUser(name, email);
//   }
// }

// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Post,
//   Put,
// } from '@nestjs/common';
// import { UserService } from './user.service';
// import { MessagePattern, Payload } from '@nestjs/microservices';
// import { CreateUserDto } from './dto/create-user.dto';
// import { User } from './entities/user.entity';
// import { UpdateUserDto } from './dto/update-user.dto';
// import {
//   ApiBadRequestResponse,
//   ApiOperation,
//   ApiParam,
//   ApiResponse,
//   ApiTags,
// } from '@nestjs/swagger';

// @ApiTags('Users')
// @Controller('users')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @MessagePattern({ cmd: 'get_users' })
//   getUsers() {
//     return this.userService.getUsers(); // Fetch all users from the database
//   }

//   // Handle the message pattern to get a specific user by ID
//   @MessagePattern({ cmd: 'get_user_by_id' })
//   @ApiOperation({ summary: 'Get user by ID' })
//   @ApiResponse({ status: 200, description: 'User fetched by ID.', type: User })
//   getUserById(@Payload() data: { id: number }) {
//     return this.userService.getUserById(data.id); // Fetch user by ID
//   }

//   @Post()
//   @ApiOperation({ summary: 'Create a new user' })
//   @ApiResponse({
//     status: 201,
//     description: 'The user has been created.',
//     type: User,
//   })
//   async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
//     return this.userService.createUser(createUserDto);
//   }

//   @Put(':id')
//   @ApiOperation({ summary: 'Update a user by ID' })
//   @ApiParam({
//     name: 'id',
//     description: 'ID of the user to update',
//     type: Number,
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'The user has been successfully updated.',
//     type: User,
//   })
//   @ApiBadRequestResponse({ description: 'User not found.' })
//   async updateUser(
//     @Param('id') id: number,
//     @Body() updateUserDto: UpdateUserDto,
//   ) {
//     return this.userService.updateUser(id, updateUserDto);
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete a user by ID' })
//   @ApiParam({
//     name: 'id',
//     description: 'ID of the user to delete',
//     type: Number,
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'The user has been successfully deleted.',
//   })
//   @ApiBadRequestResponse({ description: 'User not found.' })
//   async deleteUser(@Param('id') id: number) {
//     return this.userService.deleteUser(id);
//   }
// }

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all users with their orders' })
  @ApiResponse({ status: 200, description: 'List of users with orders.' })
  async getUsers() {
    try {
      return await this.userService.getUsers();
    } catch (error) {
      throw new HttpException(
        'Error fetching users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID along with orders' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'User and associated orders retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserById(@Param('id') id: number) {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error fetching user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing user by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to update',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.userService.updateUser(id, updateUserDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error updating user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to delete',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deleteUser(@Param('id') id: number) {
    try {
      return await this.userService.deleteUser(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error deleting user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
