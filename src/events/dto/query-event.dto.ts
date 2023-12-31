import { Event } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class EventQuery {
  @ApiProperty()
  id: string;

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

  @ApiProperty()
  status?: string;
  // @ApiProperty({ type: () => StatusEntity })
  // status: StatusEntity;

  @ApiProperty()
  artists?: Array<string>;
  // @ApiProperty({ type: () => ArtistEntity })
  // artist: ArtistEntity;

  //@ApiProperty()
  //categoryId?: string;
  // @ApiProperty({ type: () => CategoryEntity })
  // category: CategoryEntity;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
  
}