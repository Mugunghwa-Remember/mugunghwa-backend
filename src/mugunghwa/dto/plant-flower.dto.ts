import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PlantFlowerDto {
  @IsString()
  @ApiProperty({
    example: '홍길동동',
    // description: 'this is name of swagger study',
  })
  name: string;

  @IsString()
  @ApiProperty({
    example: '이 멋진 세상에 영광을',
    // description: 'this is name of swagger study',
  })
  message: string;

  @IsNumber()
  @ApiProperty({
    example: 37.2429358,
    // description: 'this is name of swagger study',
  })
  latitude: number;

  @IsNumber()
  @ApiProperty({
    example: 131.8565424,
    // description: 'this is name of swagger study',
  })
  longitude: number;
}
