import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({
  timestamps: true,
  collection: 'admin_directory',
})
export class Admin {
  @Prop({ required: true, trim: true })
  adminName!: string;

  @Prop({ required: true, trim: true })
  phone!: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    index: true,
  })
  email!: string;

  @Prop({ trim: true })
  image?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  })
  organizationId!: Types.ObjectId;

  @Prop({
    required: true,
    select: false,
  })
  password!: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);