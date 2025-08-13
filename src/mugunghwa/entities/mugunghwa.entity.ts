import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MugunghwaEntity {
  @ObjectIdColumn({ name: '_id' })
  id: ObjectId;

  @Column()
  userEmail: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  message: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
