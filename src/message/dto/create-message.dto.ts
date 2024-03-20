// dto/create-message.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  orderId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;
}
