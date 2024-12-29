import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResearchDocumentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  studentId: string;

  @IsNotEmpty()
  teacherId: string;
}
