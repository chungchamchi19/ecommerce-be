import { Column, Entity, OneToMany, JoinColumn, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import media from "../routes/media";
import { Media } from "./media";
import { ProductCollection } from "./productCollection";

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
  @JoinColumn({ name: "thumbnailId", referencedColumnName: "id" })
  media?: Media;
}
