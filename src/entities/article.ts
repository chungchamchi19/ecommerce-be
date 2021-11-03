import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./user";
import "reflect-metadata";
import { ArticleTag } from "./articleTag";

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  avatar: string;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  isDeleted: boolean;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.articles) @JoinColumn({ name: "userId" }) user: User;

  @OneToMany(() => ArticleTag, (articleTag) => articleTag.article)
  articleTags: ArticleTag[];
}
