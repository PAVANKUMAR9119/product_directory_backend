import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Organization,
  OrganizationDocument,
} from './schemas/organization.schema';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<OrganizationDocument>,
  ) {}

  async create(dto: CreateOrganizationDto) {
    try {
      const organization = new this.organizationModel({
        ...dto,
        email: dto.email.toLowerCase(),
      });

      return await organization.save();
    } catch (error) {
    

      throw error;
    }
  }

  async findAll() {
    return this.organizationModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid organization ID');
    }

    const organization = await this.organizationModel
      .findById(id)
      .exec();

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid organization ID');
    }

    try {
      const updatedOrganization =
        await this.organizationModel.findByIdAndUpdate(
          id,
          {
            ...dto,
            ...(dto.email && {
              email: dto.email.toLowerCase(),
            }),
          },
          {
            new: true,
            runValidators: true,
          },
        );

      if (!updatedOrganization) {
        throw new NotFoundException('Organization not found');
      }

      return updatedOrganization;
    } catch (error) {
    

      throw error;
    }
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid organization ID');
    }

    const deletedOrganization =
      await this.organizationModel.findByIdAndDelete(id);

    if (!deletedOrganization) {
      throw new NotFoundException('Organization not found');
    }

    return {
      message: 'Organization deleted successfully',
      id,
    };
  }
}