// src/user/user.controller.ts

import { Controller, Get, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Public()
  @Delete()
  removeAll() {
    return this.userService.removeAll();
  }

  @Public()
  @Delete(':id')
  remove(@GetUser() user, @Param('id') id: string) {
    return this.userService.remove(id);
  }
}
