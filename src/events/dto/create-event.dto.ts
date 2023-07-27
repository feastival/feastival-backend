import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateEventDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  imageUrl?: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  location: string;
  @ApiProperty()
  venue?: string;
  @ApiProperty()
  organizer?: string;
  @ApiProperty()
  startedAt: Date;
  @ApiProperty()
  finishedAt: Date;

  @IsOptional()
  statusId?: string;
  @IsOptional()
  categoryId?: string;
  @IsOptional()
  artistId?: string;
  @IsOptional()
  userId?: string;
}
