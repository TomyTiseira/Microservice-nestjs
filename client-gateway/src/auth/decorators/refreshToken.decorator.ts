import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const RefreshToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    // Buscar el refreshToken en las cookies
    const refreshToken = (request.cookies as { refreshToken?: string })
      .refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Token not found in request');
    }

    return refreshToken;
  },
);
