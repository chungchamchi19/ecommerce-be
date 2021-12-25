import { MediaMap } from "./mediaMap";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from "typeorm";
import "reflect-metadata";
import { Media } from "./media";
import { Variant } from "./variant";
import { Option } from "./option";
import { Vendor } from "./vendor";
import { ProductCollection } from "./productCollection";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title?: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  status?: string;

  @Column({ nullable: true })
  vendorId?: number;

  @Column({ default: 0 })
  price?: number;

  @Column({ default: 0 })
  comparePrice?: number;

  @Column()
  featureImageId?: number;

  @Column()
  url?: string;

  @Column()
  bestSelling?: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt?: Date;

  @OneToOne(() => Media, (media) => media.product)
  @JoinColumn({ name: "featureImageId", referencedColumnName: "id" })
  featureImage?: Media;

  @OneToMany(() => MediaMap, (mediaMap) => mediaMap.product)
  mediaMaps?: MediaMap[];

  @OneToMany(() => Variant, (variant) => variant.product)
  variants?: Variant[];

  @OneToMany(() => Option, (option) => option.product)
  options?: Option[];

  @ManyToOne(() => Vendor, (vendor) => vendor.products)
  vendor?: Vendor;

  @OneToMany(() => ProductCollection, (productCollection) => productCollection.product)
  productCollections?: ProductCollection[];

  // custom field
  media?: Media[];
  availableNumber?: number;
  collections?: number[];
}
