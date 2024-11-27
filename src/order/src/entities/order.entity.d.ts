import { User } from '../../../user/src/entities/user.entity';
export declare class Order {
    id: number;
    item: string;
    quantity: number;
    price: number;
    userId: number;
    user: User;
}
