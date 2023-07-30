import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsDate,
  IsDateString,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from './status.enum';
import { LocationDTO } from './location.dto';

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
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty()
  startedAt?: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty()
  finishedAt?: Date;

  @IsInt()
  @Min(0)
  @Max(999_999_999)
  @IsOptional()
  @ApiProperty()
  price?: number;

  @IsEnum(Status, { each: true })
  @IsOptional()
  @ApiProperty()
  status?: string = 'upcoming';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty()
  genre: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty()
  artists: string[];

  @ValidateNested()
  @ApiProperty()
  @Type(() => LocationDTO)
  location: LocationDTO;
}
