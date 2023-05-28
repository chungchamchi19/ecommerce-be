import { Option } from "./option";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import "reflect-metadata";
import { OptionValueVariant } from "./optionValueVariant";

@Entity()
export class OptionValue {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  value?: string;

  @Column()
  optionId?: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", select: false })
  createdAt?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", select: false })
  updatedAt?: Date;

  @ManyToOne(() => Option, (option) => option.optionValues, { onDelete: "CASCADE" })
  @JoinColumn({ name: "optionId", referencedColumnName: "id" })
  option?: Option;

  @OneToMany(() => OptionValueVariant, (optionValueVariant) => optionValueVariant.optionValue)
  optionValueVariants?: OptionValueVariant[];
}
