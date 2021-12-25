import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Province } from './province';
import { Ward } from './ward';

@Entity()
export class District {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  provinceId: string;

  @ManyToOne(() => Province, (province) => province.districts)
  @JoinColumn({ name: 'provinceId', referencedColumnName: 'id' })
  province: Province;

  @OneToMany(() => Ward, (ward) => ward.district)
  wards: Ward[];
}
