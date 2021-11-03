import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./user";
import "reflect-metadata";
import { ArticleTag } from "./articleTag";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title?: string;

  @Column()
  createdAt?: Date;

  @Column()
  updatedAt?: Date;

  @Column()
  isDeleted?: boolean;

  @Column()
  userId?: number;

  @ManyToOne(() => User, (user) => user.tags) @JoinColumn({ name: "userId" }) user?: User;

  @OneToMany(() => ArticleTag, (articleTag) => articleTag.tag)
  articleTags?: ArticleTag[];
}
