import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@ApiTags('foydalanuvchilar')
@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Get('profile')
  @ApiOperation({ summary: 'Foydalanuvchini Profilini korish' })
  @ApiOkResponse({ description: 'User data' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  getProfile(@Req() req: Request) {
    return this.userService.getProfile(req['user']);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Barcha Foydalanuvchilarni korish' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('serach') search: string,
  ) {
    return this.userService.findAll(page, limit, search);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Foydalanuvchini id boyicha qidirish' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
  })
  @ApiNotFoundResponse({ description: 'User NOT_FOUND' })
  @ApiOkResponse({ description: 'User data' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Foydalanuvchini id boyicha yangilash' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  @ApiNotFoundResponse({ description: 'User NOT_FOUND' })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
  })
  @ApiOkResponse({ description: 'User is Updated' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Foydalanuvchini id boyicha ochirish' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
  })
  @ApiNotFoundResponse({ description: 'User NOT_FOUND' })
  @ApiOkResponse({ description: 'User is Deleted' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
