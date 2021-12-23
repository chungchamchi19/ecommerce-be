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

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt?: Date;

  @OneToMany(() => Product, (product) => product.vendor)
  @JoinColumn({ name: "vendorId", referencedColumnName: "id" })
  products?: Product[];
}
