import { ApiProperty } from '@nestjs/swagger';

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
    
    statusId: string;
    categoryId: string;
    artistId: string;
    userId: string;
  }
  