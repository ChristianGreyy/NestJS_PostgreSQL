import { BadRequestException, Inject, Injectable, Post } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import LoginDto from './dtos/login.dto';
import RegisterDto from './dtos/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: typeof User,
    private readonly userService: UsersService,
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

    return 'token';

    // return await tokenService.generateAuthTokens(user);
  }

  async register(registerDto: RegisterDto): Promise<User> {
    // Check user exists ?
    const user: any = await this.usersRepository.findOne({
      where: { username: registerDto.username },
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const newUser = await this.userService.createUser(registerDto);

    return newUser;
  }
}
