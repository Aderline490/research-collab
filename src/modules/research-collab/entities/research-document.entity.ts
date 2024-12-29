import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Feedback } from './feedback.entity';
import { EResearchDocumentStatus } from '../enums/EResearchDocumentStatus';

@Entity('research_documents')
export class ResearchDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => User)
  student: User;

  @ManyToOne(() => User, { nullable: false })
  teacher: User;

  @OneToMany(() => Feedback, (feedback) => feedback.document)
  feedback: Feedback[];

  @Column({ default: EResearchDocumentStatus.IN_DEVELOPMENT })
  status: EResearchDocumentStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
