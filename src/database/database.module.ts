// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Order } from '../order/src/entities/order.entity';
// import { User } from '../user/src/entities/user.entity';
// // import dotenv from 'dotenv';

// // dotenv.config();

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: '127.0.0.1',
//       port: 3306,
//       username: 'root',
//       password: '',
//       database: 'user_db',
//       // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//       entities: [User],
//       synchronize: true,
//       logging: true,
//     }),
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: '127.0.0.1',
//       port: 3306,
//       username: 'root',
//       password: '',
//       database: 'order_db',
//       // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//       entities: [Order],
//       synchronize: true,
//       logging: true,
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
        host: configService.get('DB1_HOST', '127.0.0.1'),
        port: configService.get<number>('DB1_PORT', 3306),
        username: configService.get('DB1_USERNAME', 'root'),
        password: configService.get('DB1_PASSWORD', ''),
        database: configService.get('DB1_NAME', 'order-db'),
        entities: [Order],
        synchronize: true,
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'usersConnection',
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB2_HOST', '127.0.0.1'),
        port: configService.get<number>('DB2_PORT', 3306),
        username: configService.get('DB2_USERNAME', 'root'),
        password: configService.get('DB2_PASSWORD', ''),
        database: configService.get('DB2_NAME', 'user-db'),
        entities: [User],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
