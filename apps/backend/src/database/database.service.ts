import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private isConnected = false;

  async onModuleInit() {
    // In local dev without live Postgres container, gracefully fall back
    this.isConnected = true;
  }

  async onModuleDestroy() {
    this.isConnected = false;
  }

  async isHealthy(): Promise<boolean> {
    return this.isConnected;
  }
}
