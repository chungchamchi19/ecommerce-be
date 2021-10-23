import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import 'reflect-metadata';
import { Article } from '../article';
import { Tag } from '../tag';

@Entity()
export class ArticleTag {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  tagId?: number;

  @Column()
  articleId?: number;

  @Column()
  createdAt?: Date;

  @Column()
  updatedAt?: Date;

  @Column()
  isDeleted?: boolean;

  @ManyToOne(() => Article, (article) => article.id, { cascade: true })
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  article?: Article;

  @ManyToOne(() => Tag, (tag) => tag.id, { cascade: true })
  @JoinColumn({ name: 'tagId', referencedColumnName: 'id' })
  tag?: Tag;
}
