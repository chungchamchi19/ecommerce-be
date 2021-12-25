import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { District } from './district';

@Entity()
export class Province {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @OneToMany(() => District, (district) => district.province)
  districts: District[];
}
