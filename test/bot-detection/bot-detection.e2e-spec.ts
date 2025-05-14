import { Test } from '@nestjs/testing';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Mongoose } from 'mongoose';
import { AppModule } from '../../src/app.module';
import { HttpHeaderKey, Verdict } from '../../src/bot-detection/bot-detection.enum';
import { ConfigService } from '@nestjs/config';
import { thresholdScore } from '../../src/bot-detection/bot-detection.constants';

describe('BotDetectionController (e2e)', () => {
  let app;
  let mongoose: Mongoose;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(new FastifyAdapter());
    await app.init();

    const config = app.get(ConfigService);
    await app.getHttpAdapter().getInstance().ready();

    mongoose = new Mongoose();
    await mongoose.connect(config.get('MONGO_URI'));
  });

  beforeEach(async () => {
    await mongoose.connection.db!.collection('userAgentSafety').deleteMany({});
    await mongoose.connection.db!.collection('appLogs').deleteMany({});
  });

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
  });

  describe('GET /bot-detection/verdict', () => {
    it('should return bot verdict when headers are missing', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/bot-detection/verdict',
        headers: {
          [HttpHeaderKey.UserAgent]: 'Mozilla/5.0',
          [HttpHeaderKey.Host]: 'example.com',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.verdict).toBe(Verdict.Bot);
      expect(body.score).toBe(1);
    });

    it('should return bot verdict for known crawler user agent', async () => {
      const crawlerUA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

      const response = await app.inject({
        method: 'GET',
        url: '/bot-detection/verdict',
        headers: {
          [HttpHeaderKey.Host]: 'example.com',
          [HttpHeaderKey.UserAgent]: crawlerUA,
          [HttpHeaderKey.Accept]: '*/*',
          [HttpHeaderKey.AcceptLanguage]: 'en-US',
          [HttpHeaderKey.AcceptEncoding]: 'gzip',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.verdict).toBe(Verdict.Bot);
      expect(body.score).toBe(1);
    });

    it('should return bot verdict when headers are in incorrect order', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/bot-detection/verdict',
        headers: {
          [HttpHeaderKey.Host]: 'example.com',
          [HttpHeaderKey.UserAgent]: 'Mozilla/5.0',
          [HttpHeaderKey.AcceptLanguage]: 'en-US',
          [HttpHeaderKey.Accept]: '*/*',
          [HttpHeaderKey.AcceptEncoding]: 'gzip',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.verdict).toBe(Verdict.Bot);
      expect(body.score).toBe(1);
    });

    it('should return human verdict for legitimate request', async () => {
      const legitimateUA = `Mozilla/5.0 (Windows NT 10.0; Win64; x64)
        AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 
        Safari/537.36`;

      const response = await app.inject({
        method: 'GET',
        url: '/bot-detection/verdict',
        headers: {
          [HttpHeaderKey.Host]: 'example.com',
          [HttpHeaderKey.UserAgent]: legitimateUA,
          [HttpHeaderKey.Accept]:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          [HttpHeaderKey.AcceptLanguage]: 'en-US,en;q=0.5',
          [HttpHeaderKey.AcceptEncoding]: 'gzip, deflate, br',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.verdict).toBe(Verdict.Human);
      expect(body.score).toBeLessThan(thresholdScore);
    });
  });
});
