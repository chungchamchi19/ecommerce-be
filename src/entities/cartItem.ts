import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import "reflect-metadata";
import { Article } from "./article";
import { Tag } from "./tag";
import { Cart } from "./cart";
import { Variant } from "./variant";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  cartId?: number;

  @Column()
  variantId?: number;

  @Column()
  quantity?: number;

  @ManyToOne(() => Cart, (cart) => cart.id, { cascade: true })
  @JoinColumn({ name: "cartId", referencedColumnName: "id" })
  cart?: Cart;

  @OneToOne(() => Variant, (variant) => variant.id, { cascade: true })
  @JoinColumn({ name: "variantId", referencedColumnName: "id" })
  variant?: Variant;
}
