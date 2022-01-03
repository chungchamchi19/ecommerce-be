import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./user";
import "reflect-metadata";

@Entity()
export class UserMeta {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  key?: string;

  @Column()
  value?: string;

  @Column()
  createdAt?: Date;

  @Column()
  updatedAt?: Date;

  @Column()
  userId?: number;

  @ManyToOne(() => User, (user) => user.userMetas)
  @JoinColumn({ name: "userId" })
  user?: User;
}
