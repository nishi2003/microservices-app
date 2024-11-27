import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
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

  @Column()
  userId: number;
  // @ManyToOne(() => User)
  // @JoinColumn()
  // user: User;
  // @ManyToOne(() => User, (user) => user.orders)
  // user: User;
  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // Establish the foreign key relationship
  user: User;
}
