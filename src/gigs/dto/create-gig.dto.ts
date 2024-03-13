import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateGigDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsInt()
  deliveryTime: number;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsInt()
  revisions: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.split(',') : value),
    { toClassOnly: true },
  )
  @IsString({ each: true })
  features: string[];

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsInt()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  shortDesc: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Images for the gig',
  })
  images: any[];
}
