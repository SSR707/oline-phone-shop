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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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
import { Public } from 'src/decorator/auth.decorator';

@ApiTags('Products')
@ApiBearerAuth('access-token')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Order yaratish' })
  @ApiOkResponse({ description: 'Created' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha Productlarni Korish' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('serach') search: string,
  ) {
    return this.productService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Productni id boyicha qidirish' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Productlarniid boyicha yangilash' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  @ApiNotFoundResponse({ description: 'Product NOT_FOUND' })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
  })
  @ApiOkResponse({ description: 'Product is Updated' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Product id boyicha ochirish' })
  @ApiUnauthorizedResponse({ description: 'Token Not Found' })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this resource',
  })
  @ApiNotFoundResponse({ description: 'Product NOT_FOUND' })
  @ApiOkResponse({ description: 'Prouct is Deleted' })
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
