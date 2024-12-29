import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchDocument } from './entities/research-document.entity';
import { Feedback } from './entities/feedback.entity';
import { DocumentVersion } from './entities/document-version.entity';
import { ResearchCollabController } from './controllers/research-collab.controller';
import { ResearchCollabService } from './services/research-collab.service';
import { DocumentVersionService } from './services/document-version.service';
import { NotificationsService } from '../notifications/services/notifications.service';
import { ResearchDocumentRepository } from './repositories/research-document.repository';
import { FeedbackRepository } from './repositories/feedback.repository';
import { DocumentVersionRepository } from './repositories/document-version.repository';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notification.module';

@Module({
    imports: [TypeOrmModule.forFeature([ResearchDocument, Feedback, DocumentVersion]), AuthModule, NotificationsModule],
    controllers: [ResearchCollabController],
    providers: [
        ResearchCollabService,
        DocumentVersionService,
        NotificationsService,
        ResearchDocumentRepository,
        FeedbackRepository,
        DocumentVersionRepository,
      ],
})
export class ResearchCollabModule {}
