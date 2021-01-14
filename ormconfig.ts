import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'mongodb',
  host: process.env.DB_HOSTNAME || 'localhost',
  port: +process.env.DB_PORT || 27017,
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  synchronize: true,
  dropSchema: false,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
  logging: false,
  entities: [`src/entity/*.entity.ts`],
  migrations: [`src/migration/*.ts`],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration'
  }
};

export = config;
