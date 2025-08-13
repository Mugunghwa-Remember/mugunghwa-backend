import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MugunghwaEntity } from './entities/mugunghwa.entity';
import { MongoRepository } from 'typeorm';
import { PlantFlowerDto } from './dto/plant-flower.dto';

@Injectable()
export class MugunghwaService {
  constructor(
    @InjectRepository(MugunghwaEntity)
    private mugunghwaRepository: MongoRepository<MugunghwaEntity>,
  ) {}

  plantFlower(userEmail: string, plantFlowerDto: PlantFlowerDto) {
    const mugunghwa = this.mugunghwaRepository.create({
      userEmail,
      ...plantFlowerDto,
    });
    delete (mugunghwa as { id?: unknown }).id;
    return this.mugunghwaRepository.save(mugunghwa);
  }

  async getTotalFlowerCount() {
    const currentCount = await this.mugunghwaRepository.count();

    return {
      currentCount,
      targetCount: 800000,
    };
  }

  async getAllFlowers() {
    const flowers = await this.mugunghwaRepository.find();

    return flowers.map((flower) => ({
      id: flower.id.toString(),
      userEmail: flower.userEmail,
      name: flower.name,
      message: flower.message,
      latitude: flower.latitude,
      longitude: flower.longitude,
      plantedAt: flower.createdAt,
    }));
  }
}
