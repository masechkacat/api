import { IsString, IsOptional, IsEmail } from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsOptional()
  @IsString()
  readonly fullName?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;
}
