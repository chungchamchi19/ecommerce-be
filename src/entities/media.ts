import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import "reflect-metadata";
import { Product } from "./product";
import { Variant } from "./variant";

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

  @OneToOne(() => Variant, (variant) => variant.featureImage)
  variant?: Product;
}
