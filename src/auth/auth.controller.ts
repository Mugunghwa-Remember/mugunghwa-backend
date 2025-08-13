import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequestDto } from './dto/auth-request.dto';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login/kakao')
  async kakaoLogin(
    @Body() authRequestDto: AuthRequestDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.kakaoLogin(authRequestDto);

    if (result.status == 'LOGIN_SUCCESS') {
      res.cookie('refreshToken', result.refreshToken);
      delete (result as any).refreshToken;
    }
    return res.send(result);
  }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const newAccessToken = await this.authService.refresh(
        req.cookies.refreshToken,
      );
      console.log(newAccessToken);
    } catch (err) {
      console.log(err);
      res.clearCookie('refreshToken');
      throw new UnauthorizedException();
    }
  }
}
