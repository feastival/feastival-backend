import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { EventEntity } from './entities/event.entity';

@Controller('events')
@ApiTags('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiCreatedResponse({ type: EventEntity })
  async create(@Body() createEventDto: CreateEventDto) {
    const createdEvent = await this.eventsService.create(createEventDto);
    return new EventEntity(createdEvent);
  }

  @Get()
  @ApiOkResponse({ type: EventEntity, isArray: true })
  async findAll() {
    const events = await this.eventsService.findAll();
    return events.map((event) => new EventEntity(event));
  }

  @Get(':id')
  @ApiOkResponse({ type: EventEntity })
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);
    return new EventEntity(event);
  }

  @Patch(':id')
  @ApiOkResponse({ type: EventEntity })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const updatedEvent = await this.eventsService.update(id, updateEventDto);
    return new EventEntity(updatedEvent);
  }

  @Delete(':id')
  @ApiOkResponse({ type: EventEntity })
  async remove(@Param('id') id: string) {
    const deletedEvent = await this.eventsService.remove(id);
    return new EventEntity(deletedEvent);
  }
}
