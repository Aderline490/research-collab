import { IsNotEmpty } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  documentId: string;

  @IsNotEmpty()
  teacherId: string;

  @IsNotEmpty()
  comment: string;
}
