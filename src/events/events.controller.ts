import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { EventEntity } from './entities/event.entity';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('events')
@ApiTags('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: EventEntity })
  async create(@Request() req, @Body() createEventDto: CreateEventDto) {
    const organizerId = req.user.id;
    const createdEvent = await this.eventsService.create(
      organizerId,
      createEventDto,
    );
    return new EventEntity(createdEvent);
  }

  //@Get()
  //@ApiOkResponse({ type: EventEntity, isArray: true })
  //async findAll() {
  //const events = await this.eventsService.findAll();
  //return events.map((event) => new EventEntity(event));
  //}
  @Get()
  @ApiOkResponse({ type: EventEntity, isArray: true })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Search events by name',
  })
  @ApiQuery({
    name: 'location',
    required: false,
    description: 'Search events by location',
  })
  async findAll(
    @Query('name') name?: string,
    @Query('location') location?: string,
  ) {
    const events = await this.eventsService.findAll(name, location);
    return events.map((event) => new EventEntity(event));
  }

  @Get(':id')
  @ApiOkResponse({ type: EventEntity })
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);
    return new EventEntity(event);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity })
  async update(
    @Request() req,
    @Param('id') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const organizerId = req.user.id;
    const updatedEvent = await this.eventsService.update(
      organizerId,
      eventId,
      updateEventDto,
    );
    return new EventEntity(updatedEvent);
  }

  // @Delete(':id')
  // @UseGuards(JwtAuthGuard, AdminGuard)
  // @ApiBearerAuth()
  // @ApiOkResponse({ type: EventEntity })
  // async remove(@Param('id') id: string) {
  //   const deletedEvent = await this.eventsService.remove(id);
  //   return new EventEntity(deletedEvent);
  // }
}
