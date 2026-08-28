import { Injectable } from '@nestjs/common';
import { DockerContainerRecord } from '@atlas-os/shared';

@Injectable()
export class DockerIntegrationService {
  private containers: Map<string, DockerContainerRecord> = new Map();

  constructor() {
    this.seedDefaultContainers();
  }

  public getContainers(): DockerContainerRecord[] {
    return Array.from(this.containers.values());
  }

  public toggleContainer(id: string): DockerContainerRecord | null {
    const container = this.containers.get(id);
    if (container) {
      container.status = container.status === 'running' ? 'stopped' : 'running';
      return container;
    }
    return null;
  }

  private seedDefaultContainers() {
    const defaults: DockerContainerRecord[] = [
      {
        id: 'doc_1',
        name: 'atlas-redis-cache',
        image: 'redis:7-alpine',
        status: 'running',
        ports: '6379:6379',
        created: new Date().toISOString()
      },
      {
        id: 'doc_2',
        name: 'atlas-postgres-vector',
        image: 'ankane/pgvector:v0.5.1',
        status: 'running',
        ports: '5432:5432',
        created: new Date().toISOString()
      }
    ];

    defaults.forEach((c) => this.containers.set(c.id, c));
  }
}
