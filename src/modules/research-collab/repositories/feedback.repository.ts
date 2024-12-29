import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from '../entities/feedback.entity';
import { CreateFeedbackDto } from '../dtos/create-feedback.dto';

@Injectable()
export class FeedbackRepository {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  create(createFeedbackDto: CreateFeedbackDto) {
    const { documentId, teacherId, comment } = createFeedbackDto;
    const feedback = {
      teacher: { id: teacherId } as any,
      document: { id: documentId } as any,
      comment,
    };
    this.feedbackRepository.create(feedback);
    return this.feedbackRepository.save(feedback);
  }

  findFeedbackByDocumentId(documentId: string) {
    return this.feedbackRepository
    .createQueryBuilder('feedback')
    .where('feedback.documentId = :documentId', { documentId })
    .getMany();
  }
}
