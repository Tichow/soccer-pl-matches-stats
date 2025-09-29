import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { AppController } from './app.controller';
import { MatchService } from './match.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({ timeout: 10000, maxRedirects: 5 })],
  controllers: [MatchController, AppController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
