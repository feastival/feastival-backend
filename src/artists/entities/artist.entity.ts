import { Artist } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ArtistEntity implements Artist {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  events: Array<Object>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
