import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderProductService } from './order-product.service';
import { CreateOrderProductDto } from './dto/create-order-product.dto';
import { UpdateOrderProductDto } from './dto/update-order-product.dto';
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

@ApiTags('Orders_Products')
@ApiBearerAuth('access-token')
@Controller('order-product')
export class OrderProductController {
  constructor(private readonly orderProductService: OrderProductService) {}

  @Post()
  @ApiOperation({ summary: 'Orders_Products yaratish' })
  @ApiOkResponse({ description: 'Created' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  create(@Body() createOrderProductDto: CreateOrderProductDto) {
    return this.orderProductService.create(createOrderProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Orders_Products yaratish Orderlarni Kprish' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('serach') search: string,
  ) {
    return this.orderProductService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Orders_Product larni id boyicha qidirish' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  findOne(@Param('id') id: string) {
    return this.orderProductService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Orders_Productlarni  id boyicha yangilash' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  @ApiNotFoundResponse({ description: 'Orders_Products NOT_FOUND' })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
  })
  @ApiOkResponse({ description: 'Orders_Products is Updated' })
  update(
    @Param('id') id: string,
    @Body() updateOrderProductDto: UpdateOrderProductDto,
  ) {
    return this.orderProductService.update(+id, updateOrderProductDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Orders_Products id boyicha ochirish' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
  })
  @ApiNotFoundResponse({ description: 'Orders_Products NOT_FOUND' })
  @ApiOkResponse({ description: 'Orders_Products is Deleted' })
  remove(@Param('id') id: string) {
    return this.orderProductService.remove(+id);
  }
}
