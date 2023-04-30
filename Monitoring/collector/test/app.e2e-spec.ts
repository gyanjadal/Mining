import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/telemetry/pull ({POST})', async () => {
    const data = { minerId: 'e1595467-c219-4061-a0f9-2164a8618466', minerUrl: 'http://localhost:3310/telemetry/' };
    const response = await request(app.getHttpServer())
        .post('/telemetry/pull')
        .send(data)
        .expect(201)

      expect(response.body.minerId).toEqual("e1595467-c219-4061-a0f9-2164a8618466");
  });
});
