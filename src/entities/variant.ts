import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from "typeorm";
import "reflect-metadata";
import { Product } from "./product";
import { Media } from "./media";
import { OptionValueVariant } from "./optionValueVariant";

@Entity()
export class Variant {
  @PrimaryGeneratedColumn()
  id?: number;

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

  @OneToMany(() => OptionValueVariant, (optionValueVariant) => optionValueVariant.variant)
  optionValueVariants?: OptionValueVariant[];

  //custom field
  option1?: string;
  option2?: string;
  option3?: string;
  options?: string[];
  available?: boolean;
  name?: string;
  publicTitle?: string;
}
