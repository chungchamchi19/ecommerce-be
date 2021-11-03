import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import "reflect-metadata";

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  targetId?: number;

  @Column({ nullable: true })
  targetType?: string;

  @Column()
  link?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt?: Date;

  @Column()
  type?: string;
}
