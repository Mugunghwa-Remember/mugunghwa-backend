import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthRequestDto } from './dto/auth-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async kakaoLogin(authRequestDto: AuthRequestDto): Promise<{
    status: string;
    accessToken?: string;
    refreshToken?: string;
    email?: string;
    provider?: string;
  }> {
    console.log(process.env.KAKAO_CLIENT_ID);
    try {
      const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_CLIENT_ID!,
          redirect_uri: authRequestDto.redirectUri,
          code: authRequestDto.code,
          client_secret: process.env.KAKAO_CLIENT_SECRET || '', // 생략 가능
        }).toString(),
      });
      if (!tokenRes.ok) {
        throw new HttpException(
          {
            status: 'KAKAO_TOKEN_ERROR',
            message: '카카오 토큰 발급에 실패했습니다.',
            code: 401,
          },
          401,
        );
      }

      const token = await tokenRes.json();
      const kakoAccessToken = token.access_token;

      const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${kakoAccessToken}`,
        },
      });
      if (!userRes.ok) {
        throw new HttpException(
          {
            status: 'KAKAO_USER_ERROR',
            message: '카카오 사용자 정보 조회에 실패했습니다.',
          },
          402,
        );
      }

      const kakaoUser = await userRes.json();
      const email = kakaoUser.kakao_account.email;
      if (!email) {
        throw new HttpException(
          {
            status: 'KAKAO_EMAIL_ERROR',
            message: '카카오 사용자 이메일 조회에 실패했습니다.',
          },
          402,
        );
      }

      const user =
        (await this.userService.findOneByEmailAndProvider(email, 'kakao')) ||
        (await this.userService.create({
          email,
          provider: 'kakao',
        }));
      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(user);

      return {
        status: 'LOGIN_SUCCESS',
        email,
        provider: 'kakao',
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (err) {
      console.error('[카카오 로그인 실패]', err);
      throw new InternalServerErrorException('카카오 로그인 실패');
    }
  }

  async refresh(refreshToken: string) {
    try {
      const decodedRefreshToken = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const userId = decodedRefreshToken.userId;
      const user =
        await this.userService.getUserWithCurrentRefreshToken(userId);
      if (!user) {
        throw new UnauthorizedException('user not found');
      }

      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user?.refreshToken,
      );

      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid refresh-token');
      }

      const accessToken = this.generateAccessToken(user);

      return accessToken;
    } catch (err) {
      console.error('[갱신 실패]', err);
      throw new UnauthorizedException('갱신 실패');
    }
  }

  generateAccessToken(user: UserEntity) {
    const payload = {
      userId: user.id,
    };

    return this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(user: UserEntity) {
    const payload = {
      userId: user.id,
    };

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    const saltOrRounds = 10;
    const currentRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);

    await this.userService.setCurrentRefreshToken(user.id, currentRefreshToken);

    return refreshToken;
  }
}
