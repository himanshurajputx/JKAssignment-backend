import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Blog API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let createdBlogId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Log in to get access token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/authentication/login')
      .send({
        email: 'himanshu@123',
        password: '12345678',
      });

    accessToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/blogs (POST) - should create a new blog', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/blogs')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        blogTitle: 'DataSource API',
        blogDescription: 'Options used to create this dataSource...',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    createdBlogId = response.body.id;
  });

  it('/api/blogs?limit=10&page=1 (GET) - should return blogs with pagination', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/blogs?limit=10&page=1')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });

  it('/api/blogs/blog-list?limit=10&page=1 (GET) - should return blog list', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/blogs/blog-list?limit=10&page=1')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
  });

  it('/api/blogs/details/:id (GET) - should return blog details', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/blogs/details/${createdBlogId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdBlogId);
  });

  it('/api/blogs/:id (PUT) - should update the blog', async () => {
    const response = await request(app.getHttpServer())
      .put(`/api/blogs/${createdBlogId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        blogTitle: 'Updated Blog Title',
        blogDescription: 'Updated description for the blog...',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Blog updated successfully');
  });

  it('/api/blogs/:id (DELETE) - should delete the blog', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/blogs/${createdBlogId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Blog deleted successfully');
  });

  it('/api/blogs/:id (DELETE) - should return error if blog does not exist', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/blogs/non-existing-id`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Blog is not deleted');
  });
});
