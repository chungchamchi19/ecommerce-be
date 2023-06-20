import { Column, Entity, OneToMany, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
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

  @Column({ unique: true })
  thumbnailId?: number;

  @OneToMany(() => ProductCollection, (productCollection) => productCollection.collection)
  productCollections?: ProductCollection[];

  @OneToOne(() => Media, (media) => media.collection)
  @JoinColumn({ name: "thumbnailId", referencedColumnName: "id" })
  media?: Media;
}
