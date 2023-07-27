import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(query: string) {
    const artists = await this.prismaService.artist.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
    return artists;
  }

  async findOne(id: string) {
    const artist = await this.prismaService.artist.findUnique({
      where: {
        id: id,
      },
      include: {
        events: true,
      },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with id: ${id} does not exist.`);
    }

    return artist;
  }

  async create(input) {
    const newArtist = await this.prismaService.artist.create({
      data: {
        name: input.name,
        description: input.description,
        imageUrl: input.imageUrl,
      },
    });
    return newArtist;
  }

  async update(id: string, input) {
    const artist = await this.prismaService.artist.findUnique({
      where: { id: id },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with id: ${id} does not exist.`);
    }

    const updatedArtist = await this.prismaService.artist.update({
      where: { id: id },
      data: {
        name: input.name,
        description: input.description,
        imageUrl: input.imageUrl,
      },
    });

    return updatedArtist;
  }

  async remove(id: string) {
    const artist = await this.prismaService.artist.findUnique({
      where: { id: id },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with id: ${id} does not exist.`);
    }

    await this.prismaService.artist.delete({
      where: { id: id },
    });

    return {};
  }
}
