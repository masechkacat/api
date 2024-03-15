import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsArray } from 'class-validator';

export class EditGigDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  deliveryTime?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  revisions?: number;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shortDesc?: string;
}
