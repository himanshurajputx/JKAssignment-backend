import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/authentication/register (POST) - should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/authentication/register')
      .send({
        name: 'Himanshu',
        email: 'himanshu@123',
        password: '12345678',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', 'himanshu@123');
  });

  it('/api/authentication/login (POST) - should log in a user and return a token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/authentication/login')
      .send({
        email: 'himanshu@123',
        password: '12345678',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    accessToken = response.body.accessToken;
  });

  it('/api/authentication/login (POST) - should return error for invalid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/authentication/login')
      .send({
        email: 'invalid@123',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
  });
});
