import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Example Name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Example description' })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'imageUrl.jpg' })
  imageUrl: string;
}
