import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AdminsService } from '../admin/admin.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly adminsService: AdminsService) {}

  async login(dto: LoginDto) {
    const admin = await this.adminsService.findByEmailWithPassword(
      dto.email,
    );

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (admin.password !== dto.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      message: 'Login successful',
      admin: {
        id: admin._id,
        adminName: admin.adminName,
        email: admin.email,
        organizationId: admin.organizationId,
      },
    };
  }
}
