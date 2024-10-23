// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// @Entity()
// export class OrderEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   item: string;

//   @Column()
//   quantity: number;

//   @Column()
//   price: number;
// }

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../../user/src/entities/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  item: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  // @Column()
  // user_id: number;
  // @ManyToOne(() => User)
  // @JoinColumn()
  // user: User;
  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}
