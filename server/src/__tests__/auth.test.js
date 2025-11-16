import { jest } from '@jest/globals';
import authService from '../services/authService.js';
import User from '../models/User.js';

// Mock dependencies
jest.mock('../models/User.js');
jest.mock('../utils/jwt.js', () => ({
  generateAccessToken: jest.fn(() => 'mock-access-token'),
  generateRefreshToken: jest.fn(() => 'mock-refresh-token'),
  verifyRefreshToken: jest.fn(() => ({ userId: 'mock-user-id' }))
}));
jest.mock('../utils/eventBus.js', () => ({
  emitNotification: jest.fn()
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        role: 'customer',
        save: jest.fn().mockResolvedValue(true)
      };
      User.mockImplementation(() => mockUser);

      const result = await authService.register('test@example.com', 'password123');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error if user already exists', async () => {
      User.findOne = jest.fn().mockResolvedValue({ email: 'test@example.com' });

      await expect(
        authService.register('test@example.com', 'password123')
      ).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        role: 'customer',
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true)
      };
      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await authService.login('test@example.com', 'password123');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw error for invalid credentials', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        authService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });
});

