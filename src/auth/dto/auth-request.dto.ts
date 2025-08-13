import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthRequestDto {
  @IsString()
  @ApiProperty({
    example: 'code',
    // description: 'this is name of swagger study',
  })
  code: string;
}
