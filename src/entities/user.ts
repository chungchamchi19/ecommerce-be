import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./article";
import { Order } from "./order";
import { Tag } from "./tag";
import { UserMeta } from "./userMeta";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column({ nullable: true })
  avatar?: number | null;

  @Column({ nullable: true })
  phone?: string | null;

  @Column()
  email?: string;

  @Column()
  password?: string;

  @Column({ type: "enum", default: "user" })
  role?: "admin" | "user";

  @Column({ nullable: true })
  deviceId?: string | null;

  @OneToMany(() => Article, (article) => article.user) articles?: Article[];

  @OneToMany(() => Tag, (tag) => tag.user) tags?: Tag[];

  @OneToMany(() => Order, (order) => order.user) orders?: Order[];

  @OneToMany(() => UserMeta, (userMeta) => userMeta.user) userMetas?: UserMeta[];
}
