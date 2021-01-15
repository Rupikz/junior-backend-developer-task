import { Entity, Column, ObjectID } from 'typeorm';
import { RootEntity } from './root.entity';

@Entity()
export class Token extends RootEntity {
  @Column('text')
  user_id: ObjectID;

  @Column()
  token_id: string;

  @Column()
  token: string;
}
