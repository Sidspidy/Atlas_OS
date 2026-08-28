import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RedisService } from '../redis/redis.service';

@Controller()
export class HealthController {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly redisService: RedisService
  ) {}

  @Get('health')
  async checkHealth() {
    const dbConnected = await this.dbService.isHealthy();
    const redisConnected = await this.redisService.isHealthy();

    const isOk = dbConnected && redisConnected;

    return {
      status: isOk ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: dbConnected,
        redis: redisConnected,
        gateway: true
      }
    };
  }

  @Get('api/status')
  getStatus() {
    return {
      application: 'Atlas OS Backend',
      version: '0.1.0',
      phase: 1,
      mode: 'operational'
    };
  }
}
