
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import {
  Product_directory,
  ProductDocument,
} from './../schemas/product.schema';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {

  constructor(
    @InjectModel(Product_directory.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  // CREATE PRODUCT
  async createProduct(createProductDto: CreateProductDto) {

    try {

      const product = new this.productModel(
        createProductDto,
      );

      return await product.save();

    } catch (error) {

     
      throw error;
    }
  }

  // GET ALL PRODUCTS
  async getAllProducts() {

    return this.productModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  // GET PRODUCT BY ID
  async getProductById(id: string) {

    if (!isValidObjectId(id)) {
      throw new BadRequestException(
        'Invalid product ID',
      );
    }

    const product = await this.productModel
      .findById(id)
      .exec();

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    return product;
  }

  // GET PRODUCT BY CODE
  async getProductByCode(code: string) {

    const product = await this.productModel
      .findOne({
        code: code.toUpperCase(),
      })
      .exec();

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    return product;
  }

  // UPDATE PRODUCT
  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ) {

    if (!isValidObjectId(id)) {
      throw new BadRequestException(
        'Invalid product ID',
      );
    }

    try {

      const product = await this.productModel
        .findByIdAndUpdate(
          id,
          updateProductDto,
          {
            new: true,
            runValidators: true,
          },
        )
        .exec();

      if (!product) {
        throw new NotFoundException(
          'Product not found',
        );
      }

      return product;

    } catch (error) {

     

      throw error;
    }
  }

  async updateProductImage(id: string, image: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(
        'Invalid product ID',
      );
    }

    const product = await this.productModel
      .findByIdAndUpdate(
        id,
        { image },
        { new: true, runValidators: true },
      )
      .exec();

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    return product;
  }

  // DELETE PRODUCT
  async deleteProduct(id: string) {

    if (!isValidObjectId(id)) {
      throw new BadRequestException(
        'Invalid product ID',
      );
    }

    const product = await this.productModel
      .findByIdAndDelete(id)
      .exec();

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    return {
      message: 'Product deleted successfully',
      id: product._id,
    };
  }
}