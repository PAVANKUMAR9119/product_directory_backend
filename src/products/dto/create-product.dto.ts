
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  hsn?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  gst!: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  cost!: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  sellingPrice!: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  mrp!: number;

  @IsOptional()
  @IsString()
  offerCode?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  technicalName?: string;

  @IsOptional()
  @IsDateString()
  dateOfManufacture?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  manufacturingCompany?: string;

  @IsOptional()
  @IsString()
  marketingCompany?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  customerCare?: string;

  @IsOptional()
  @IsString()
  batchNumber?: string;
}