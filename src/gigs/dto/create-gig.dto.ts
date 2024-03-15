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
    ({ value }) => {
      if (typeof value === 'string' && value) {
        return value.split(',');
      } else if (Array.isArray(value)) {
        return value;
      }
      return undefined;
    },
    { toClassOnly: true },
  )
  features?: string[];

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
  @Transform(
    ({ value }) => {
      if (typeof value === 'string' && value) {
        return value.split(',');
      } else if (Array.isArray(value)) {
        return value;
      }
      return undefined;
    },
    { toClassOnly: true },
  )
  images?: string[];
}
