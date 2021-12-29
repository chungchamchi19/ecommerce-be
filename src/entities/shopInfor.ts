import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import "reflect-metadata";

@Entity()
export class ShopInfor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: null })
  facebook: string;

  @Column({ nullable: true, default: null })
  zalo: string;

  @Column({ nullable: true, default: null })
  bossName: string;

  @Column({ nullable: true, default: null })
  email: string;

  @Column({ nullable: true, default: null })
  phone: string;

  @Column({ nullable: true, default: null })
  bankAccountId: string;
  @Column({ nullable: true, default: null })
  address: string;

  @Column({ nullable: true, default: null })
  youtube: string;

  @Column({ nullable: true, default: null })
  instagram: string;

  @Column({ nullable: true, default: 0 })
  shipFee: number;
}
