import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './intefaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private config: ConfigService,
    private usersService: UsersService,
  ) {
    const refreshJwtSecret =
      typeof config.get<string>('REFRESH_JWT_SECRET') === 'string'
        ? config.get<string>('REFRESH_JWT_SECRET')
        : null;
    if (!refreshJwtSecret) {
      throw new Error('REFRESH_JWT_SECRET is not defined in configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      secretOrKey: refreshJwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(
    req: { body: { refresh_token?: string } },
    payload: JwtPayload,
  ) {
    const user = await this.usersService.findProfile(payload.sub);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const refreshToken = req.body.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return user;
  }
}
