import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService],
  imports: [PrismaModule],
})
export class ArtistsModule {}
