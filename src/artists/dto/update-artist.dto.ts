import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateArtistDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'Example Name' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'Example description' })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'imageUrl.jpg' })
  imageUrl: string;
}
