import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from 'src/auth/dto/register-auth.dto';

@Injectable()
export class CustomJwtService {
  constructor(private readonly jwtService: JwtService) {}
  async generateRefreshToken(user) {
    const payload = { sub: user.email, role: user.role, id: user.id };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
    return refreshToken;
  }

  async generateAccessToken(user) {
    const payload = { sub: user.email, role: user.role, id: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
    return accessToken;
  }
}
