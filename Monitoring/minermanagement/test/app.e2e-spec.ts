import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/miner/list (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/miner/list')
      .query({limit: 10})
      .expect(200);
      
      expect(response.body.length).toEqual(10);

  });

  //TODO - Need to mock these data changing tests
    it('/miner/onboard (POST)', async () => {
    const data = { minerUrl: 'http://localhost:3310/telemetry/' };
    const response = await request(app.getHttpServer())
      .post('/miner/onboard/')
      .send(data)
      .expect(201);

      expect(response.body.minerUrl).toEqual(data.minerUrl);

  });
});
