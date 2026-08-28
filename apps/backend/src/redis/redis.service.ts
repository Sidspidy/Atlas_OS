import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class RedisService implements OnModuleInit {
  private isConnected = false;

  async onModuleInit() {
    this.isConnected = true;
  }

  async isHealthy(): Promise<boolean> {
    return this.isConnected;
  }
}
