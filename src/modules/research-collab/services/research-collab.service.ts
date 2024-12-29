import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ResearchDocumentRepository } from '../repositories/research-document.repository';
import { FeedbackRepository } from '../repositories/feedback.repository';
import { CreateResearchDocumentDto } from '../dtos/create-research-document.dto';
import { CreateFeedbackDto } from '../dtos/create-feedback.dto';
import { DocumentVersionService } from './document-version.service';
import { NotificationsService } from 'src/modules/notifications/services/notifications.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ResearchDocument } from '../entities/research-document.entity';
import { User } from 'src/modules/auth/entities/user.entity';
import { DocumentVersionRepository } from '../repositories/document-version.repository';
import { UpdateResearchDocumentDto } from '../dtos/update-research-document.dto';
import { EResearchDocumentStatus } from '../enums/EResearchDocumentStatus';

@Injectable()
export class ResearchCollabService {
  constructor(
    private readonly researchDocumentRepository: ResearchDocumentRepository,
    private readonly documentVersionRepository: DocumentVersionRepository,
    private readonly feedbackRepository: FeedbackRepository,
    private readonly documentVersionService: DocumentVersionService,
    private readonly notificationService: NotificationsService,
  ) {}

  async createDocument(createResearchDocumentDto: CreateResearchDocumentDto) {
    const document = await this.researchDocumentRepository.create(
      createResearchDocumentDto,
    );
    console.log('this is the document i just created', document);
    await this.documentVersionService.createInitialVersion(
      document,
      createResearchDocumentDto.content,
    );
    this.notificationService.notifyUsers('New document created');
    return document;
  }

  async updateDocument(
    documentId: string,
    updateResearchDocumentDto: UpdateResearchDocumentDto,
  ) {
    const document =
      await this.researchDocumentRepository.findOneWithRelations(documentId);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.status != EResearchDocumentStatus.IN_DEVELOPMENT) {
      throw new BadRequestException('You have already submitted this document for review. You can\'t edit it');
    }

    const newVersion = await this.documentVersionService.createNewVersion(
      documentId,
      updateResearchDocumentDto.content,
    );

    return {
      message: 'Document updated successfully',
      document: {
        id: document.id,
        title: document.title,
        latestVersion: newVersion.version,
        content: newVersion.content,
      },
    };
  }

  async createFeedback(createFeedbackDto: CreateFeedbackDto) {
    const document = await this.researchDocumentRepository.findOne(
      createFeedbackDto.documentId,
    );

    if (!document) {
      throw new NotFoundException('Research document not found');
    }

    if (document.teacher.id !== createFeedbackDto.teacherId) {
      throw new ForbiddenException(
        'You are not authorized to provide feedback for this document',
      );
    }

    const feedback = this.feedbackRepository.create(createFeedbackDto);

    this.notificationService.notifyUsers('New feedback added');
    return feedback;
  }

  async getAllStudentDocuments(studentId: string) {
    return this.researchDocumentRepository.getAllStudentDocuments(studentId);
  }

  async getAllTeacherDocuments(teacherId: string) {
    return this.researchDocumentRepository.getAllTeacherDocuments(teacherId);
  }

  async getSingleDocuments(documentId: string, currentUser: User) {
    const document =
      await this.researchDocumentRepository.findOneWithRelations(documentId);

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (
      currentUser.role === 'student' &&
      document.student.id !== currentUser.id
    ) {
      throw new Error('You are not authorized to access this document');
    }

    if (
      currentUser.role === 'teacher' &&
      document.teacher.id !== currentUser.id
    ) {
      throw new Error('You are not authorized to access this document');
    }

    const latestVersion = await this.documentVersionRepository.getLatestVersion(
      document.id,
    );

    if (!latestVersion) {
      throw new NotFoundException('No versions found for the document');
    }

    const history = await this.documentVersionRepository.getHistory(
      documentId,
      latestVersion.version,
    );

    return {
      document,
      latestVersion,
      history,
    };
  }

  async getFeedbackForDocument(documentId: string, currentUser: User) {
    const document =
      await this.researchDocumentRepository.findOneWithRelations(documentId);

    if (!document) {
      throw new NotFoundException('Document not found');
    }
    const hasAccess =
      currentUser.id === document.student?.id ||
      currentUser.id === document.teacher?.id;

    if (!hasAccess) {
      throw new ForbiddenException(
        "You do not have access to this document's feedback",
      );
    }

    return document.feedback;
  }

  async submitDocument(documentId: string, currentUser: User) {
    const document =
      await this.researchDocumentRepository.findOneWithRelations(documentId);

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.student.id !== currentUser.id) {
      throw new UnauthorizedException(
        'You are not authorized to submit this document',
      );
    }

    if (document.status !== EResearchDocumentStatus.IN_DEVELOPMENT) {
      throw new BadRequestException(
        'Only documents in development can be submitted for review',
      );
    }

    document.status = EResearchDocumentStatus.IN_REVIEW;
    await this.researchDocumentRepository.save(document);

    return {
      message: 'Document submitted successfully',
      document,
    };
  }

  async deEscalateDocument(documentId: string, currentUser: User) {
    const document =
      await this.researchDocumentRepository.findOneWithRelations(documentId);

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.teacher.id !== currentUser.id) {
      throw new UnauthorizedException(
        'You are not authorized to de-escalate this document',
      );
    }

    if (document.status !== EResearchDocumentStatus.IN_REVIEW) {
      throw new BadRequestException(
        'Only documents in review can be de-escalated back to the student',
      );
    }

    document.status = EResearchDocumentStatus.IN_DEVELOPMENT;
    await this.researchDocumentRepository.save(document);

    return {
      message: 'Document de-escalated successfully',
      document,
    };
  }

  async approveDocument(documentId: string, currentUser: User) {
    const document =
      await this.researchDocumentRepository.findOneWithRelations(documentId);

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.teacher.id !== currentUser.id) {
      throw new UnauthorizedException(
        'You are not authorized to approve this document',
      );
    }

    if (document.status !== EResearchDocumentStatus.IN_REVIEW) {
      throw new BadRequestException(
        'Only documents in review can be approved',
      );
    }

    document.status = EResearchDocumentStatus.APPROVED;
    await this.researchDocumentRepository.save(document);

    return {
      message: 'Document approved successfully',
      document,
    };
  }
}
