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
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdatePartialUserDto } from './dto/update-user-partial.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // const hashedPassword = await bcrypt.hash(
    //   createUserDto.password,
    //   parseInt(process.env.BCRYPT_SALT_ROUND),
    // );

    // createUserDto.password = hashedPassword;

    // return this.prisma.user.create({ data: createUserDto });

    // Check if a user with the given email already exists
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if a user with the given username already exists
    const existingUserByUsername = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUserByUsername) {
      throw new ConflictException('Username is already taken');
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      parseInt(process.env.BCRYPT_SALT_ROUND),
    );

    const roleId = await this.getRoleId(createUserDto.role);

    // Create the user in the database
    const newUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        password: hashedPassword,
        roleId: roleId, //process.env.PREDEFINED_USER_ROLE_ID,
      },
      select: {
        id: true,
        email: true,
        username: true,
        imageUrl: true,
      },
    });

    return newUser;
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        trackedEvents: {
          include: {
            location: true,
            organizer: {
              select: {
                id: true,
                email: true,
                username: true,
                imageUrl: true,
              },
            },
          },
        },
        createdEvents: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} does not exist.`);
    }

    return { ...user, role: user.role.name };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

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

  async updatePartial(
    id: string,
    updatePartialUserDto: UpdatePartialUserDto,
  ): Promise<UserEntity> {
    // Fetch the user to check if it exists
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id: ${id} does not exist.`);
    }

    if (updatePartialUserDto.password) {
      updatePartialUserDto.password = await bcrypt.hash(
        updatePartialUserDto.password,
        parseInt(process.env.BCRYPT_SALT_ROUND),
      );
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updatePartialUserDto,
      });
      return new UserEntity(updatedUser);
    } catch (error) {
      // Handle known Prisma error codes
      if (error instanceof PrismaClientKnownRequestError) {
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
        include: {
          trackedEvents: true,
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

  private async getRoleId(roleName: string) {
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new Error(`Status "${role}" is not found`);
    }
    return role.id;
  }
}
