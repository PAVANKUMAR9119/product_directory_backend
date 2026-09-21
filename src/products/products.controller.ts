
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
  ParseFilePipeBuilder,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const productUploadDirectory = join(
  process.cwd(),
  'uploads/products',
);

mkdirSync(productUploadDirectory, { recursive: true });

@Controller('products')
export class ProductsController {

  constructor(
    private readonly productsService: ProductsService,
  ) {}

  // CREATE
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ) {

    return this.productsService.createProduct(
      createProductDto,
    );
  }

  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: productUploadDirectory,
        filename: (_request, file, callback) => {
          callback(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (_request, file, callback) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              'Only JPG, JPEG, PNG, and WebP images are allowed',
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async uploadProductImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/i,
          fallbackToMimetype: true,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024,
        })
        .build({ fileIsRequired: true }),
    )
    file: { filename: string },
  ) {
    return this.productsService.updateProductImage(
      id,
      `/uploads/products/${file.filename}`,
    );
  }

  // GET ALL
  @Get()
  async getAllProducts() {

    return this.productsService.getAllProducts();
  }

  // GET BY CODE
  @Get('code/:code')
  async getProductByCode(
    @Param('code') code: string,
  ) {

    return this.productsService.getProductByCode(
      code,
    );
  }

  // GET BY ID
  @Get(':id')
  async getProductById(
    @Param('id') id: string,
  ) {

    return this.productsService.getProductById(
      id,
    );
  }

  // UPDATE
  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {

    return this.productsService.updateProduct(
      id,
      updateProductDto,
    );
  }

  // DELETE
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(
    @Param('id') id: string,
  ) {

    return this.productsService.deleteProduct(
      id,
    );
  }
}