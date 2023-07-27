import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from './entities/artist.entity';

//import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
//import { AdminGuard } from '../auth/guards/admin.guard';

import {
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

@Controller('artists')
@ApiTags('artists')
export class ArtistsController {
  constructor(private artistsService: ArtistsService) {}

  @Get()
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiOkResponse({ type: ArtistEntity, isArray: true })
  async findAll(@Query('q') query?: string): Promise<Object> {
    return await this.artistsService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: ArtistEntity })
  async findOne(@Param('id') id: string) {
    return await this.artistsService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: ArtistEntity })
  async create(@Body() createArtistDto: CreateArtistDto) {
    return await this.artistsService.create(createArtistDto);
  }

  @Put(':id')
  @ApiOkResponse({ type: ArtistEntity })
  async update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return await this.artistsService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @ApiOkResponse({})
  async remove(@Param('id') id: string) {
    return await this.artistsService.remove(id);
  }
}
