// import { Module } from '@nestjs/common';
// import { UserController } from './user.controller';
// import { UserService } from './user.service';
// import { ClientsModule, Transport } from '@nestjs/microservices';

// @Module({
//   imports: [
//     ClientsModule.register([
//   //     {
//   //       name: 'USER_SERVICE',
//   //       transport: Transport.TCP,
//   //       options: { host: '127.0.0.1', port: 3001 },
//   //     },
//       {
//         name: 'ORDER_SERVICE',
//         transport: Transport.TCP,
//         options: { host: '127.0.0.1', port: 3002 },
//       },
//     ]),
//   ],
//   controllers: [UserController],
//   providers: [UserService],
// })
// export class UserModule {}

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './entities/user.entity';
// import { UserService } from './user.service';
// import { UserController } from './user.controller';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: process.env.DB_HOST,
//       port: Number(process.env.DB_PORT),
//       username: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       entities: [User],
//       synchronize: true,
//     }),
//     TypeOrmModule.forFeature([User]),
//   ],
//   controllers: [UserController],
//   providers: [UserService],
// })
// export class UserModule {}


// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/src/entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
