import { Event } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { Exclude } from 'class-transformer';

export class EventEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  imageUrl?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  startedAt: Date;

  @ApiProperty()
  finishedAt: Date;

  @ApiProperty()
  price?: number;

  @ApiProperty()
  status?: string;

  @ApiProperty()
  genre?: Array<string>;

  @ApiProperty()
  artists?: Array<object>;

  @ApiProperty()
  location: Object;

  @ApiProperty()
  organizer: Object;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  organizerId: String;

  @Exclude()
  statusId: String;

  @Exclude()
  locationId: String;

  constructor(partial: Partial<EventEntity>) {
    Object.assign(this, partial);
  }
}
