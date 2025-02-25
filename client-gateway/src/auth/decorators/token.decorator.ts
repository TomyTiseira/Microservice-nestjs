import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    // Buscar el authToken en las cookies
    const authToken = request.cookies.authToken;

    if(!authToken) {
      throw new UnauthorizedException('Token not found in request');
    }

    return authToken;
  }
)
