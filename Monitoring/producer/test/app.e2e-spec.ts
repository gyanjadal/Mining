import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TELEMETRYPOINTS } from './../src/telemetry/constants';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  //Valid request
  it('/telemetry (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/telemetry/e1595467-c219-4061-a0f9-2164a8618466')
      .expect(200)

      expect(response.body.minerId).toEqual("e1595467-c219-4061-a0f9-2164a8618466");
  });

  //Invalid request
  it('/telemetry (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/telemetry/invalid_uuid')
      .expect(400)
  });

});
