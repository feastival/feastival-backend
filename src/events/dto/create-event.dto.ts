import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
  IsDateString,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from './status.enum';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  imageUrl: string;

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
  venue: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  organizer: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  startedAt: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  finishedAt: Date;

  @IsEnum(Status, { each: true })
  @IsOptional()
  @ApiProperty()
  status: string = 'upcoming';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty()
  artists: string[];

  // @IsString()
  // @IsOptional()
  // @ApiProperty()
  // categoryId?: string;
}
