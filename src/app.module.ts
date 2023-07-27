import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';

@Module({
  imports: [AuthModule, PrismaModule, EventsModule, UsersModule, ArtistsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
