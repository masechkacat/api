import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditUserDto {
  @ApiProperty({
    example: 'exampleUsername',
    description: 'Username of the user',
  })
  @IsOptional()
  @IsString()
  readonly username?: string;

  @ApiProperty({
    example: 'New Full Name',
    description: 'New full name of the user',
  })
  @IsOptional()
  @IsString()
  readonly fullName?: string;

  @ApiProperty({
    example: 'exampleDescription',
    description: 'Description of the user',
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    example: 'newemail@example.com',
    description: 'New email of the user',
  })
  @IsOptional()
  @IsEmail()
  readonly email?: string;
}
