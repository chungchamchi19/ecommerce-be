import { Column, Entity, OneToMany, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { collection1637198775086 } from "../migrations/1637198775086-collection";

import { ProductCollection } from "./productCollection";

@Entity()
export class Collection {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title?: string;

    @Column()
    description?: string;

    @OneToMany(() => ProductCollection, (productCollection) => productCollection.collection)
    productCollections?: ProductCollection[];
}