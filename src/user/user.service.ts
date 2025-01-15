import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getProfile(user) {
    return this.userRepository.findOne({ where: { id: user.id } });
  }

  async findAll(page: number, limit: number, search: string) {
    const offsate = (page - 1) * limit;
    return this.userRepository.find({
      where: [
        { fullname: Like(`%${search}%`) },
        { age: +Like(`%${search}%`) },
        { email: Like(`%${search}%`) },
        { phone: Like(`%${search}%`) },
      ],
      skip: offsate,
      take: limit,
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    const newUserData = Object.assign(user, updateUserDto);
    await this.userRepository.save(newUserData);
    return { status: HttpStatus.OK, message: 'User is Updated' };
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.remove(user);
    return { status: HttpStatus.OK, message: 'User is Deleted' };
  }
}
