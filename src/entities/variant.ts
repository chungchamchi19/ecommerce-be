import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import "reflect-metadata";
import { Article } from "./article";
import { Tag } from "./tag";
import { Cart } from "./cart";
import { Product } from "./product";
import { Media } from "./media";

@Entity()
export class Variant {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  option1?: string;
  @Column()
  option2?: string;
  @Column()
  option3?: string;
  @Column()
  price?: number;
  @Column()
  comparePrice?: number;
  @Column()
  availableNumber?: number;
  @Column()
  featureImageId?: number;
  @Column()
  productId?: number;
  @ManyToOne(() => Product, (product) => product.id, { cascade: true })
  @JoinColumn({ name: "productId", referencedColumnName: "id" })
  product?: Product;
  
  @OneToOne(() => Media, (media) => media.variant)
  @JoinColumn({ name: "featureImageId", referencedColumnName: "id" })
  featureImage?: Media;
}
