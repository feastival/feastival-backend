import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  create(createEventDto: CreateEventDto) {
    return this.prisma.event.create({ data: createEventDto });
  }

  findAll() {
    return this.prisma.event.findMany();
  }

  findOne(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      // include: {
      //   user: true,
      //   status: true,
      //   category: true,
      //   artist: true,
      // },
    });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.prisma.event.update({
      where: { id },
      data: updateEventDto,
      // include: {
      //   user: true,
      //   status: true,
      //   category: true,
      //   artist: true,
      // },
    });
  }

  remove(id: string) {
    return this.prisma.event.delete({ where: { id } });
  }
}
