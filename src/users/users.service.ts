import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      parseInt(process.env.BCRYPT_SALT_ROUND),
    );

    createUserDto.password = hashedPassword;

    return this.prisma.user.create({ data: createUserDto });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = this.prisma.user.findUnique({
      where: { id },
      include: {
        trackedEvents: true,
        createdEvents: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} does not exist.`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} does not exist.`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        parseInt(process.env.BCRYPT_SALT_ROUND),
      );
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      return updatedUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            `The ${error.meta.target} is invalid or already taken`,
          );
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} does not exist.`);
    }

    return this.prisma.user.delete({ where: { id } });
  }

  async trackEvent(userId: string, eventId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        trackedEvents: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${userId} does not exist.`);
    }

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with id: ${eventId} does not exist.`);
    }

    const isEventAlreadyTracked = user.trackedEvents.some(
      (event) => event.id === eventId,
    );

    if (!isEventAlreadyTracked) {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          trackedEvents: {
            connect: { id: eventId },
          },
        },
        select: {
          trackedEvents: true,
          createdEvents: true,
        },
      });
      return updatedUser;
    } else {
      throw new ConflictException(
        `Event with id: ${eventId} is already tracked.`,
      );
    }
  }

  async untrackEvent(userId: string, eventId: string): Promise<UserEntity> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        trackedEvents: {
          disconnect: [{ id: eventId }],
        },
      },
      include: { trackedEvents: true },
    });

    return new UserEntity(updatedUser);
  }
}
