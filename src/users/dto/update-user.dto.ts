import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'user@example.com' })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'username' })
  username: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'imageUrl.jpg' })
  imageUrl: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @ApiProperty()
  password: string;
}
