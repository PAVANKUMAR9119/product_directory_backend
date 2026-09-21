import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product_directory>;

@Schema({
  timestamps: true,
  collection: 'products_directory',
})
export class Product_directory {

  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
    trim: true,
    uppercase: true,
  })
  code!: string;

  @Prop({
    required: true,
    trim: true,
    index: true,
  })
  category!: string;

  @Prop({
    required: false,
    trim: true,
  })
  description?: string;

  @Prop({
    required: false,
    trim: true,
  })
  hsn?: string;

  @Prop({
    required: true,
    min: 0,
  })
  gst!: number;

  @Prop({
    required: true,
    min: 0,
  })
  cost!: number;

  @Prop({
    required: true,
    min: 0,
  })
  sellingPrice!: number;

  @Prop({
    required: true,
    min: 0,
  })
  mrp!: number;

  @Prop({
    required: false,
    trim: true,
    uppercase: true,
  })
  offerCode?: string;

  @Prop({
    required: false,
    trim: true,
  })
  image?: string;
}

export const ProductSchema =
  SchemaFactory.createForClass(Product_directory);