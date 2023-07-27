import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    const statusId = await this.getStatusId(createEventDto.status);

    const { status, artists, ...eventData } = createEventDto;

    return await this.prisma.event.create({
      data: {
        ...eventData,
        statusId: statusId,
        artists: {
          connectOrCreate: createEventDto.artists.map((artistName) => ({
            where: { name: artistName },
            create: { name: artistName },
          })),
        },
      },
      include: {
        status: true,
        artists: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.event.findMany();
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        status: true,
        artists: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with id: ${id} does not exist.`);
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with id: ${id} does not exist.`);
    }

    const statusId = await this.getStatusId(updateEventDto.status);

    const { status, artists, ...eventData } = updateEventDto;

    return await this.prisma.event.update({
      where: { id },
      data: {
        ...eventData,
        statusId: statusId,
        artists: {
          connectOrCreate: (updateEventDto.artists || []).map((artistName) => ({
            where: { name: artistName },
            create: { name: artistName },
          })),
        },
      },
      include: {
        status: true,
        artists: true,
      },
    });
  }

  async remove(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with id: ${id} does not exist.`);
    }

    await this.prisma.event.delete({
      where: { id },
    });

    return {};
  }

  private async getStatusId(statusName: string) {
    const status = await this.prisma.status.findUnique({
      where: { name: statusName },
    });

    if (!status) {
      throw new Error(`Status "${status}" is not found`);
    }
    return status.id;
  }
}
