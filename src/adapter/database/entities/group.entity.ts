import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import { Contact } from './contact.entity';

@Entity('Groups')
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'group_name' })
  groupName: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Contact, (contact) => contact.group)
    contacts: Contact[]
}