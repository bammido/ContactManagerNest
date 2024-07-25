import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Group } from './group.entity';

@Entity('Contacts')
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @ManyToOne(() => Group, (Group) => Group.id, { cascade: true })
  @JoinColumn({ name: 'group_id' })
  groupId: string;

  //   @Column({ name: 'group_id' })

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'number' })
  number: string;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
