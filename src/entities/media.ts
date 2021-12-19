import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from "typeorm";
import "reflect-metadata";
import { Product } from "./product";
import { Variant } from "./variant";
import { MediaMap } from "./mediaMap";

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  link?: string;

  @Column()
  type?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", select: false })
  createdAt?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", select: false })
  updatedAt?: Date;

  @OneToOne(() => Product, (product) => product.featureImage)
  product?: Product;

  @OneToOne(() => Variant, (variant) => variant.featureImage)
  variant?: Variant;

  @OneToMany(() => MediaMap, (mediaMap) => mediaMap.media)
  mediaMaps?: MediaMap[];
}
