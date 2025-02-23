import { DataSourceOptions } from 'typeorm';
import * as fs from 'fs';
import { User } from 'src/users/entities/user.entity';
import { Blogs } from 'src/blogs/entities/blogs.entity';
import * as dotenv from 'dotenv';

dotenv.config();
const sslPath = process.cwd() + '/ca.pem';
let sslConfig;

try {
  if (fs.existsSync(sslPath)) {
    console.log(`SSL certificate found at ${sslPath}`);
    sslConfig = {
      rejectUnauthorized: true,
      ca: fs.readFileSync(sslPath, 'utf8'),
    };
  } else {
    console.log(
      `SSL certificate not found at ${sslPath}, using default SSL config`,
    );
    sslConfig = {
      rejectUnauthorized: true,
    };
  }
} catch (error) {
  console.error(`Error reading SSL certificate: ${error.message}`);
  sslConfig = {
    rejectUnauthorized: true,
  };
}

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: 26220, // Default to standard port if not specified
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Blogs],
  migrations: [],
  synchronize: true,
  ssl: sslConfig,
  extra: {
    connectionTimeoutMillis: 10000,
    max: 20,
  },
  logging: ['error', 'warn'],
};
