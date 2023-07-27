import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  location: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  venue?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  organizer?: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startedAt: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  finishedAt: Date;

  @IsOptional()
  statusId?: string;

  @IsOptional()
  categoryId?: string;
}
