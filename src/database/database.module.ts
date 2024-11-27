// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Order } from '../order/src/entities/order.entity';
// // import { ExampleEntity } from '../entities/example.entity';
// import { User } from '../user/src/entities/user.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: '127.0.0.1',
//       port: 3306,
//       username: 'root',
//       password: '',
//       database: 'nest-db',
//       // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//       entities: [User, Order],
//       synchronize: true,
//       // logging: true,
//     }),
//   ],
// })
// export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../user/src/entities/user.entity';
import { Order } from '../order/src/entities/order.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'ordersConnection',
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', '127.0.0.1'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'nest-db'),
        entities: [User, Order],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
