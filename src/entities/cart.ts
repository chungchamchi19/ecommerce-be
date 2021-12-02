import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Index } from "typeorm";
import { User } from "./user";
import "reflect-metadata";
import { ArticleTag } from "./articleTag";
import { CartItem } from "./cartItem";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Index({unique:true})
  userId?: number;

  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn({ name: "userId" })
  user?: User;

  @OneToMany(() => CartItem, (cartItems) => cartItems.cart)
  cartItems?: CartItem[];
}
