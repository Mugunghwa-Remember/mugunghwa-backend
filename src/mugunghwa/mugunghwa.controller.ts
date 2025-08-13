import { Controller, Post, Body, Get } from '@nestjs/common';
import { MugunghwaService } from './mugunghwa.service';
import { PlantFlowerDto } from './dto/plant-flower.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('mugunghwa')
export class MugunghwaController {
  constructor(private readonly mugunghwaService: MugunghwaService) {}

  @Post('plantFlower')
  plantFlower(@GetUser() user, @Body() plantFlowerDto: PlantFlowerDto) {
    return this.mugunghwaService.plantFlower(user.email, plantFlowerDto);
  }

  @Public()
  @Get('getTotalFlowerCount')
  getTotalFlowerCount() {
    return this.mugunghwaService.getTotalFlowerCount();
  }

  @Get('getAllFlowers')
  getAllFlowers() {
    return this.mugunghwaService.getAllFlowers();
  }
}
