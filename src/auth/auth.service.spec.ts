import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AdminsService } from '../admin/admin.service';

describe('AuthService', () => {
  let service: AuthService;
  let adminsService: { findByEmailWithPassword: jest.Mock };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    adminsService = {
      findByEmailWithPassword: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked.jwt.token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AdminsService, useValue: adminsService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return token for valid admin credentials', async () => {
    const hashedPassword = await bcrypt.hash('StrongPass123', 10);
    const admin = {
      _id: '64f2c8d6a9b1234567890abc',
      adminName: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
      organizationId: '64f2c8d6a9b1234567890abd',
    };

    adminsService.findByEmailWithPassword.mockResolvedValue(admin);

    const result = await service.login({
      email: 'john.doe@example.com',
      password: 'StrongPass123',
    });

    expect(result.accessToken).toBe('mocked.jwt.token');
    expect(jwtService.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: '64f2c8d6a9b1234567890abc',
        email: 'john.doe@example.com',
      }),
    );
  });

  it('should reject invalid password', async () => {
    const hashedPassword = await bcrypt.hash('StrongPass123', 10);
    adminsService.findByEmailWithPassword.mockResolvedValue({
      _id: '64f2c8d6a9b1234567890abc',
      email: 'john.doe@example.com',
      password: hashedPassword,
      adminName: 'John Doe',
      organizationId: '64f2c8d6a9b1234567890abd',
    });

    await expect(
      service.login({
        email: 'john.doe@example.com',
        password: 'WrongPass123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
