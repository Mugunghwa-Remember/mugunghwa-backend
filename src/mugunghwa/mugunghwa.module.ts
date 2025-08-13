import { Module } from '@nestjs/common';
import { MugunghwaService } from './mugunghwa.service';
import { MugunghwaController } from './mugunghwa.controller';
import { MugunghwaEntity } from './entities/mugunghwa.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MugunghwaEntity])],
  providers: [MugunghwaService],
  controllers: [MugunghwaController],
  exports: [MugunghwaService],
})
export class MugunghwaModule {}
