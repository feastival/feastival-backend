import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    // Step 1: Fetch a user with the given email
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Step 3: Generate a JWT containing the user's ID and return it
    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthEntity> {
    // Check if a user with the given email already exists
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if a user with the given username already exists
    const existingUserByUsername = await this.prisma.user.findUnique({
      where: { username: registerDto.username },
    });

    if (existingUserByUsername) {
      throw new ConflictException('Username is already taken');
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      parseInt(process.env.BCRYPT_SALT_ROUND),
    );

    // Create the user in the database
    const newUser = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
        roleId: process.env.PREDEFINED_USER_ROLE_ID,
      },
      select: {
        id: true,
        email: true,
        username: true,
        imageUrl: true,
      },
    });

    // Step 3: Generate a JWT containing the user's ID
    const accessToken = this.jwtService.sign({ userId: newUser.id });

    // Return the user object along with the accessToken
    return { ...newUser, accessToken };
  }
}
