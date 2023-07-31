import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.isAuthenticated()) {
      const userId = request.user.id;

      const isOrganizer = await this.isUserOrganizer(userId);

      if (isOrganizer) {
        return true;
      }
    }

    return false;
  }

  async isUserOrganizer(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.role?.name === 'organizer';
  }
}