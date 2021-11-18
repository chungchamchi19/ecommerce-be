import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from "typeorm";
import "reflect-metadata";

import { User } from "./user";
import { OrderItem } from "./orderItem";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userId?: number;

  @Column()
  totalPrice?: number;

  @Column()
  subTotal?: number;
  @Column()
  customerName: string;
  @Column()
  customerEmail: string;
  @Column()
  customerPhone: string;
  @Column()
  customerAddress: string;
  @Column()
  paymentMethod: string;
  @Column()
  status: string;
  @Column()
  deliveryMethod: string;
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt?: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user?: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  @JoinColumn({ name: "variantId", referencedColumnName: "id" })
  orderItems?: OrderItem[];
}
