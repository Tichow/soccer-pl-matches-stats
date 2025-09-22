import { NestFactory } from '@nestjs/core';
import { MatchModule } from './match.module';

async function bootstrap() {
  const app = await NestFactory.create(MatchModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Soccer PL Matches Stats API running on port ${port}`);
}
bootstrap();