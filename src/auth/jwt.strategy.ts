import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret_key', // 👈 Harus SAMA dengan di AuthModule
    });
  }

  async validate(payload: any) {
    // Tambahkan role dan studentId dari payload JWT
    return { 
      userId: payload.sub, 
      username: payload.username, 
      role: payload.role, 
      studentId: payload.studentId 
    };
  }
}