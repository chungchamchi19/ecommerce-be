import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import "reflect-metadata";
import { OptionValue } from "./optionValue";
import { Variant } from "./variant";

@Entity()
export class OptionValueVariant {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  variantId?: number;

  @Column()
  optionValueId?: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", select: false })
  createdAt?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", select: false })
  updatedAt?: Date;

  @ManyToOne(() => OptionValue, (optionValue) => optionValue.optionValueVariants)
  @JoinColumn({ name: "optionValueId", referencedColumnName: "id" })
  optionValue?: OptionValue;

  @ManyToOne(() => Variant, (variant) => variant.optionValueVariants)
  @JoinColumn({ name: "variantId", referencedColumnName: "id" })
  variant?: Variant;
}
