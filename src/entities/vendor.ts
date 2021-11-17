import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./user";
import "reflect-metadata";

import { Product } from "./product";

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @OneToMany(() => Product, (products) => products.vendor)
  @JoinColumn({ name: "vendorId", referencedColumnName: "id" })
  product?: Product[];
}
