import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ValidationPipe } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to my Movie API');
  });

  describe('/movies', () => {
    describe('GET', () => {
      it('should return 200', () => {
        return request(app.getHttpServer())
          .get('/movies')
          .expect(200)
          .expect([]);
      });
    });
    describe('POST', () => {
      it('should return 201', () => {
        return request(app.getHttpServer())
          .post('/movies')
          .send({
            title: 'Test Movie',
            genres: ['test'],
            year: 2000,
          })
          .expect(201);
      });

      it('should return 400', () => {
        return request(app.getHttpServer())
          .post('/movies')
          .send({
            title: 'Test Movie',
            genres: ['test'],
            year: 2000,
            other: 'thing',
          })
          .expect(400);
      });
    });

    describe('DELETE', () => {
      it('should return 404', () => {
        return request(app.getHttpServer()).delete('/movies').expect(404);
      });
    });
  });

  describe('/movies/:id', () => {
    describe('GET', () => {
      it('should return 200', () => {
        return request(app.getHttpServer()).get('/movies/1').expect(200);
      });

      it('should return 404', () => {
        return request(app.getHttpServer()).get('/movies/999').expect(404);
      });
    });

    describe('PATCH', () => {
      it('should return 200', () => {
        return request(app.getHttpServer())
          .patch('/movies/1')
          .send({ title: 'Updated Test' })
          .expect(200);
      });

      it('should return 404', () => {
        return request(app.getHttpServer())
          .patch('/movies/999')
          .send({ title: 'Updated Test' })
          .expect(404);
      });
    });

    describe('DELETE', () => {
      it('should return 200', () => {
        return request(app.getHttpServer()).delete('/movies/1').expect(200);
      });

      it('should return 404', () => {
        return request(app.getHttpServer()).delete('/movies/999').expect(404);
      });
    });
  });
});
