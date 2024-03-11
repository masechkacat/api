import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Only image files are allowed (.jpg, .jpeg, .png)',
  })
  file: any;
}
