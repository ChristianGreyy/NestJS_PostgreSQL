import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from './constants';
import { databaseConfig } from './database.config';
import { User } from 'src/modules/users/user.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      try {
        await sequelize.authenticate();
        console.log('Connection database successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
      sequelize.addModels([User]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
