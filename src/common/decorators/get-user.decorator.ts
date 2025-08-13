import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { UserEntity } from 'src/user/entities/user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContextHost) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as UserEntity;
  },
);
