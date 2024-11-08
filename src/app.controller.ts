import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Controller('api')
export class AppController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('ORDER_SERVICE') private readonly orderServiceClient: ClientProxy,
  ) {}

  @Get('users')
  getUsers(): Observable<any> | any {
    // return 'okkkk';
    return this.userServiceClient.send({ cmd: 'get_users' }, {}).pipe(
      catchError((err) => {
        console.error('Error fetching users:', err);
        throw new InternalServerErrorException('Failed to fetch users');
      }),
    );
  }

  @Get('orders')
  getOrders(): Observable<any> {
    return this.orderServiceClient.send({ cmd: 'get_orders' }, {}).pipe(
      catchError((err) => {
        console.error('Error fetching orders:', err);
        throw new InternalServerErrorException('Failed to fetch orders');
      }),
    );
  }
}
