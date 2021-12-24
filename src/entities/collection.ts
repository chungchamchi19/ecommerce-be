import { Column, Entity, OneToMany, JoinColumn, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { collection1637198775086 } from "../migrations/1637198775086-collection";

import { ProductCollection } from "./productCollection";
import { Media } from "./media";

@Entity()
export class Collection {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title?: string;

  @Column()
  description?: string;

  @Column()
  thumbnailId?: number;

  @OneToMany(() => ProductCollection, (productCollection) => productCollection.collection)
  productCollections?: ProductCollection[];

  @OneToOne(() => Media, (media) => media.collection)
  media?: Media;
}
