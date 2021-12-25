import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { District } from "./district";

@Entity()
export class Ward {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  districtId: string;

  @ManyToOne(() => District, (district) => district.wards)
  @JoinColumn({ name: "districtId", referencedColumnName: "id" })
  district: District;
}
