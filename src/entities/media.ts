import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import "reflect-metadata";
import { Product } from "./product";

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  targetId?: number;

  @Column({ nullable: true })
  targetType?: string;

  @Column({ select: false })
  link?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt?: Date;

  @Column()
  type?: string;

  @ManyToOne(() => Product, (product) => product.media)
  @JoinColumn({ name: "targetId", referencedColumnName: "id" })
  product?: Product;
}
