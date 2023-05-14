import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SECRETKEY } from 'src/database/constants';
import { BullModule } from '@nestjs/bull';
import { AuthConsumer } from './auth.consumer';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
    BullModule.registerQueue({
      name: 'auth',
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthConsumer],
})
export class AuthModule {}
