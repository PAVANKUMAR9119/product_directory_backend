import { Module } from '@nestjs/common';

import { AdminsModule } from '../admin/admin.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [AdminsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
