import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(organizerId: string, createEventDto: CreateEventDto) {
    const statusId = await this.getStatusId(createEventDto.status);

    //const { status, artists, genre, ...eventData } = createEventDto;

    const newEvent = await this.prisma.event.create({
      data: {
        name: createEventDto.name,
        imageUrl: createEventDto.imageUrl,
        description: createEventDto.description,
        price: createEventDto.price,
        startedAt: createEventDto.startedAt
          ? new Date(createEventDto.startedAt)
          : null,
        finishedAt: createEventDto.finishedAt
          ? new Date(createEventDto.finishedAt)
          : null,
        status: { connect: { id: statusId } },
        organizer: { connect: { id: organizerId } },
        artists: {
          connectOrCreate: createEventDto.artists?.map((artistName) => ({
            where: { name: artistName },
            create: { name: artistName },
          })),
        },
        genre: {
          connectOrCreate: createEventDto.genre?.map((genreName) => ({
            where: { name: genreName },
            create: { name: genreName },
          })),
        },
        location: createEventDto.location
          ? {
              create: createEventDto.location,
            }
          : { create: {} },
      },
      include: {
        status: true,
        artists: true,
        genre: true,
        location: true,
        organizer: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return {
      ...newEvent,
      status: newEvent.status.name,
      genre: newEvent.genre.map((genre) => genre.name),
      location: {
        ...newEvent.location,
        latitude: this.formatCoordinate(newEvent.location.latitude),
        longitude: this.formatCoordinate(newEvent.location.longitude),
      },
    };
  }

  async findAll(name: string, location: string, status: string) {
    // if (!name) {
    //   // Jika input kosong, ambil semua data events
    //   return await this.prisma.event.findMany();
    // }

    const events = await this.prisma.event.findMany({
      where: {
        AND: [
          {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          },
          {
            OR: [
              {
                location: {
                  province: {
                    contains: location,
                    mode: 'insensitive',
                  },
                },
              },
              {
                location: {
                  city: {
                    contains: location,
                    mode: 'insensitive',
                  },
                },
              },
              {
                location: {
                  venue: {
                    contains: location,
                    mode: 'insensitive',
                  },
                },
              },
              {
                location: {
                  address: {
                    contains: location,
                    mode: 'insensitive',
                  },
                },
              },
              {
                location: {
                  address: {
                    contains: location,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          },
          status // New filtering condition based on the status field
            ? {
                status: {
                  name: {
                    equals: status,
                    mode: 'insensitive',
                  },
                },
              }
            : {},
        ],
      },

      include: {
        status: true,
        artists: true,
        genre: true,
        location: true,
        organizer: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return events.map((event) => {
      return {
        ...event,
        status: event.status.name,
        genre: event.genre.map((genre) => genre.name),
        location: {
          ...event.location,
          latitude: this.formatCoordinate(event.location.latitude),
          longitude: this.formatCoordinate(event.location.longitude),
        },
      };
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        status: true,
        artists: true,
        genre: true,
        location: true,
        organizer: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with id: ${id} does not exist.`);
    }

    return {
      ...event,
      status: event.status.name,
      genre: event.genre.map((genre) => genre.name),
      location: {
        ...event.location,
        latitude: this.formatCoordinate(event.location.latitude),
        longitude: this.formatCoordinate(event.location.longitude),
      },
    };
  }

  async update(
    organizerId: string,
    eventId: string,
    updateEventDto: UpdateEventDto,
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with id: ${eventId} does not exist.`);
    }

    const statusId = updateEventDto.status
      ? await this.getStatusId(updateEventDto.status)
      : undefined;

    const { status, artists, ...eventData } = updateEventDto;

    let updateArtists = {};
    if (updateEventDto.artists?.length !== 0) {
      updateArtists = {
        set: [],
        connectOrCreate: updateEventDto.artists?.map((artistName) => ({
          where: { name: artistName },
          create: { name: artistName },
        })),
      };
    }

    let updateGenre = {};
    if (updateEventDto.genre?.length !== 0) {
      updateGenre = {
        set: [],
        connectOrCreate: updateEventDto.genre?.map((genreName) => ({
          where: { name: genreName },
          create: { name: genreName },
        })),
      };
    }

    const updatedEvent = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        name: updateEventDto.name,
        imageUrl: updateEventDto.imageUrl,
        description: updateEventDto.description,
        price: updateEventDto.price,
        startedAt: updateEventDto.startedAt
          ? new Date(updateEventDto.startedAt)
          : null,
        finishedAt: updateEventDto.finishedAt
          ? new Date(updateEventDto.finishedAt)
          : null,
        status: statusId ? { connect: { id: statusId } } : {},
        //organizer: { connect: { id: organizerId } },
        artists: updateArtists,
        genre: updateGenre,
        location: {
          update: updateEventDto.location,
        },
      },
      include: {
        status: true,
        artists: true,
        genre: true,
        location: true,
        organizer: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return {
      ...updatedEvent,
      status: updatedEvent.status.name,
      genre: updatedEvent.genre.map((genre) => genre.name),
      location: {
        ...updatedEvent.location,
        latitude: this.formatCoordinate(updatedEvent.location.latitude),
        longitude: this.formatCoordinate(updatedEvent.location.longitude),
      },
    };
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

  private formatCoordinate(coordinate): number {
    // Convert the Decimal to a standard number using the Decimal.toString() method
    const coordinateString = coordinate.toString();
    return parseFloat(coordinateString);
  }
}
