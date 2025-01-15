import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Order yaratish' })
  @ApiNotFoundResponse({ description: 'User Not Found' })
  @ApiOkResponse({ description: 'Created' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.orderService.create(createOrderDto, req['user'].id);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha Orderlarni Kprish' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('serach') search: string,
  ) {
    return this.orderService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Orderni id boyicha qidirish' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Orderlani id boyicha yangilash' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  @ApiNotFoundResponse({ description: 'Order NOT_FOUND' })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
  })
  @ApiOkResponse({ description: 'Order is Updated' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Order id boyicha ochirish' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
  })
  @ApiNotFoundResponse({ description: 'Order NOT_FOUND' })
  @ApiOkResponse({ description: 'Order is Deleted' })
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
