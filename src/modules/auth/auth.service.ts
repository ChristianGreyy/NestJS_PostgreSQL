import { BadRequestException, Inject, Injectable, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import LoginDto from './dtos/login.dto';
import RegisterDto from './dtos/register.dto';
import { UsersService } from '../users/users.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: typeof User,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectQueue('auth') private authQueue: Queue,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const user: any = await this.usersRepository.findOne({
      where: { username: loginDto.username },
    });
    if (!user) {
      throw new BadRequestException('User or password is incorrect');
    }

    const isPassword = await bcrypt.compare(loginDto.password, user.password);
    if (!isPassword) {
      throw new BadRequestException('User or password is incorrect');
    }

    const payload = { username: user.username, sub: user.id };

    console.log(payload);
    return await this.jwtService.signAsync(payload);
  }

  async register(registerDto: RegisterDto): Promise<string> {
    // Check user exists ?
    const user: any = await this.usersRepository.findOne({
      where: { username: registerDto.username },
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const job = await this.authQueue.add(
      'register',
      registerDto,
      { delay: 10000 }, // 3 seconds delayed
    );

    return 'Please wating for a few minutes ';
  }
}
