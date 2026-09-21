import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { Admin, AdminDocument } from './schemas/admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<AdminDocument>,
  ) {}

  private sanitizeAdmin(admin: any) {
    const result = admin.toObject
      ? admin.toObject()
      : { ...admin };

    delete result.password;

    return result;
  }

  async create(dto: CreateAdminDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 12);

      const admin = new this.adminModel({
        adminName: dto.adminName,
        phone: dto.phone,
        email: dto.email.toLowerCase(),
        image: dto.image,
        organizationId: new Types.ObjectId(dto.organizationId),
        password: hashedPassword,
      });

      const savedAdmin = await admin.save();

      return this.sanitizeAdmin(savedAdmin);
    } catch (error) {
    

      throw error;
    }
  }

  async findAll() {
    const admins = await this.adminModel
      .find()
      .select('-password')
      .populate('organizationId', 'name type gst')
      .sort({ createdAt: -1 })
      .exec();

    return admins;
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid admin ID');
    }

    const admin = await this.adminModel
      .findById(id)
      .select('-password')
      .populate('organizationId', 'name type gst')
      .exec();

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async update(id: string, dto: UpdateAdminDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid admin ID');
    }

    const updateData: Record<string, any> = {
      ...dto,
    };

    if (dto.email) {
      updateData.email = dto.email.toLowerCase();
    }

    if (dto.password) {
      updateData.password = await bcrypt.hash(
        dto.password,
        12,
      );
    }

    try {
      const updatedAdmin = await this.adminModel
        .findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        })
        .select('-password');

      if (!updatedAdmin) {
        throw new NotFoundException('Admin not found');
      }

      return updatedAdmin;
    } catch (error) {
     

      throw error;
    }
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid admin ID');
    }

    const deletedAdmin =
      await this.adminModel.findByIdAndDelete(id);

    if (!deletedAdmin) {
      throw new NotFoundException('Admin not found');
    }

    return {
      message: 'Admin deleted successfully',
      id,
    };
  }

  async findByEmailWithPassword(email: string) {
    return this.adminModel
      .findOne({
        email: email.toLowerCase(),
      })
      .select('+password')
      .exec();
  }
}