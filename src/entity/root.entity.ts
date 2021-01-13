import { BaseEntity, Column, CreateDateColumn, ObjectID, ObjectIdColumn } from 'typeorm';

export abstract class RootEntity extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @CreateDateColumn()
  @Column({ nullable: false, name: 'createdat' })
  createdAt: Date;
}
