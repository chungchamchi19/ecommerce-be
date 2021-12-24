import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from "typeorm";
import "reflect-metadata";
import { Product } from "./product";
import { OptionValue } from "./optionValue";

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title?: string;

  @Column()
  productId?: number;

  @Column()
  position?: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", select: false })
  createdAt?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", select: false })
  updatedAt?: Date;

  @ManyToOne(() => Product, (product) => product.options, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId", referencedColumnName: "id" })
  product?: Product;

  @OneToMany(() => OptionValue, (optionValue) => optionValue.option)
  optionValues?: OptionValue[];
}
