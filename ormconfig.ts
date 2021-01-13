import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'mongodb',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 27017,
  username: process.env.DB_USER || '',
  password: process.env.PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  synchronize: true,
  dropSchema: false,
  useUnifiedTopology: true,
  logging: false,
  entities: [`src/entity/*.entity.ts`],
  migrations: [`src/migration/*.ts`],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration'
  }
};

export = config;
