import { Injectable } from '@nestjs/common';
import { databaseConfig } from '../../database/database.config';

@Injectable()
export class ConfigService {
  get sequelizeOrmConfig() {
    return databaseConfig.development.database;
  }

  get jwtConfig() {
    return { privateKey: databaseConfig.development.jwtPrivateKey };
  }
}
