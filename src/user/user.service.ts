import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: MongoRepository<UserEntity>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }

  removeAll() {
    return this.userRepository.deleteMany({});
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }

  async create(data: { email: string; provider: string }) {
    const user = this.userRepository.create(data);
    delete (user as { id?: unknown }).id;
    return this.userRepository.save(user);
  }

  async findOneByEmailAndProvider(
    email: string,
    provider: string,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email, provider } });
  }

  async getUserWithCurrentRefreshToken(userId: string) {
    return this.userRepository.findOne({
      where: { _id: new ObjectId(userId) },
    });
  }

  async setCurrentRefreshToken(userId: ObjectId, refreshToken: string) {
    return this.userRepository.update(userId, { refreshToken: refreshToken });
  }

  async removeCurrentRefreshToken(userId: string) {
    return this.userRepository.update(userId, { refreshToken: undefined });
  }
}
