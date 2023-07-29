import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Request,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { TrackEventDto } from './dto/track-event.dto';
import { UserEntity } from './entities/user.entity';
import { EventEntity } from '../events/entities/event.entity';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

@Controller('user/me')
@ApiTags('user/me')
export class UserMeController {
  constructor(private usersService: UsersService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findMe(@Request() req) {
    const userId = req.user.id;
    return new UserEntity(await this.usersService.findOne(userId));
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    return new UserEntity(
      await this.usersService.update(userId, updateUserDto),
    );
  }

  // Modify the route to DELETE user/me directly without any parameter
  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async remove(@Request() req) {
    const userId = req.user.id;
    const deletedUser = await this.usersService.remove(userId);
    return new UserEntity(deletedUser);
  }


  @Post('track-event')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity, isArray: true })
  async addGame(@Request() req, @Body() trackEventDto: TrackEventDto) {
    const userId = req.user.id;
    const eventId = trackEventDto.eventId;
    return await this.usersService.trackEvent(userId, eventId);
  }

  @Delete('track-event/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async untrackEvent(@Request() req, @Param('id') eventId: string) {
    const userId = req.user.id;
    return new UserEntity(await this.usersService.untrackEvent(userId, eventId));
  }
}
