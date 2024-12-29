import { Controller, Get, Post, Body, Param, UseGuards, Put  } from '@nestjs/common';
import { ResearchCollabService } from '../services/research-collab.service';
import { CreateResearchDocumentDto } from '../dtos/create-research-document.dto';
import { CreateFeedbackDto } from '../dtos/create-feedback.dto';
import { Roles } from 'src/common/guards/role.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/guards/current-user';
import { User } from 'src/modules/auth/entities/user.entity';
import { UpdateResearchDocumentDto } from '../dtos/update-research-document.dto';

@Controller('research-collab')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResearchCollabController {
  constructor(private readonly researchCollabService: ResearchCollabService) {}

  @Post('document')
  @Roles('student')
  async createDocument(@Body() createResearchDocumentDto: CreateResearchDocumentDto) {
    return this.researchCollabService.createDocument(createResearchDocumentDto);
  }

  @Put('update-document/:documentId')
  @Roles('student')
  async updateDocument(@Param("documentId") documentId: string, @Body() updateResearchDocumentDto: UpdateResearchDocumentDto) {
    return this.researchCollabService.updateDocument(documentId, updateResearchDocumentDto);
  }

  @Post('feedback')
  @Roles('teacher')
  async createFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.researchCollabService.createFeedback(createFeedbackDto);
  }

  @Get('document/:documentId')
  @Roles('student', 'teacher')
  async getSingleDocument(@Param('documentId') documentId: string, @CurrentUser() currentUser: User) {
    return this.researchCollabService.getSingleDocuments(documentId, currentUser);
  }

  @Get('all-documents/by-student/:studentId')
  @Roles('student')
  async getStudentDocuments(@Param('studentId') studentId: string) {
    return this.researchCollabService.getAllStudentDocuments(studentId);
  }

  @Get('all-documents/by-teacher/:teacherId')
  @Roles('teacher')
  async getTeacherDocuments(@Param('teacherId') teacherId: string) {
    return this.researchCollabService.getAllTeacherDocuments(teacherId);
  }

  @Get('feedback/:documentId')
  @Roles('teacher', 'student')
  async getFeedback(@Param('documentId') documentId: string, @CurrentUser() currentUser: User) {
    return this.researchCollabService.getFeedbackForDocument(documentId, currentUser);
  }

  @Post('submit/:documentId')
  @Roles('student')
  async submitDocument(@Param('documentId') documentId: string, @CurrentUser() currentUser: User) {
    return this.researchCollabService.submitDocument(documentId, currentUser);
  }

  @Post('de-escalate/:documentId')
  @Roles('teacher')
  async deEscalateDocument(@Param('documentId') documentId: string, @CurrentUser() currentUser: User) {
    return this.researchCollabService.deEscalateDocument(documentId, currentUser);
  }

  @Post('approve/:documentId')
  @Roles('teacher')
  async approveDocument(@Param('documentId') documentId: string, @CurrentUser() currentUser: User) {
    return this.researchCollabService.approveDocument(documentId, currentUser);
  }
}
