import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/auth/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    // The user object is attached to request by Passport
    return request.user;
  },
);