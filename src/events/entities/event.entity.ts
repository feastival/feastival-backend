import { Event } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class EventEntity {
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
  statusId: string;
  // @ApiProperty({ type: () => StatusEntity })
  // status: StatusEntity;

  @ApiProperty()
  categoryId: string;
  // @ApiProperty({ type: () => CategoryEntity })
  // category: CategoryEntity;

  @ApiProperty()
  artistId: string;
  // @ApiProperty({ type: () => ArtistEntity })
  // artist: ArtistEntity;

  @ApiProperty()
  userId: string;
  @ApiProperty({ type: () => UserEntity })
  user: UserEntity;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<Event>) {
    Object.assign(this, partial);
  }
}
