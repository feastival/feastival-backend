import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TrackEventDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'eventId' })
  eventId: string;
}
