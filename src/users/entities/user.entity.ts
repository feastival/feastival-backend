import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { EventEntity } from 'src/events/entities/event.entity';

export class UserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  imageUrl?: string;

  @Exclude()
  password: string;

  @Exclude()
  roleId?: string;
  // role: RoleEntity;

  @ApiProperty()
  role?: string;
  // role: RoleEntity;

  @ApiProperty()
  events?: EventEntity[];
  // comments: CommentEntity;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
