import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.isAuthenticated()) {
      const userId = request.user.id;

      const isAdmin = await this.isUserAdmin(userId);

      if (isAdmin) {
        return true;
      }
    }
    return false;
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.role?.name === 'admin';
  }
}
