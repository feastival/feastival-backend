import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserMeController } from './user.me.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [UsersController, UserMeController],
  providers: [UsersService],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
