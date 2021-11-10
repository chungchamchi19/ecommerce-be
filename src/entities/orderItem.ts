import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import "reflect-metadata";
import { Variant } from "./variant";
import { Order } from "./order";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id?: number;
  
  @Column()
  price?: number;
  @Column()
  comparePrice?: number;

  @Column()
  quantity? :number;
  @Column()
  orderId?: number;
  @Column()
  variantId?: number;
//   @Column()
//   poductTitle: string;
  
  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: "orderId", referencedColumnName: "id" })
  order?: Order;

  @OneToOne(() => Variant, (variant) => variant.id, { cascade: true })
  @JoinColumn({ name: "variantId", referencedColumnName: "id" })
  variant?: Variant;
}
