import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsDate,
  IsDateString,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LocationDTO {
  @IsString()
  @IsOptional()
  @ApiProperty()
  venue?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  address?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  mapsURL?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  province?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  city?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  street?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  streetDetails?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  postalCode?: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  longitude?: number;
}
