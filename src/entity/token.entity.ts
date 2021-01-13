import { Entity, Column } from 'typeorm';
import { RootEntity } from './root.entity';

@Entity()
export class Token extends RootEntity {
  @Column()
  token: string;
}
