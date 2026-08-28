import { Injectable } from '@nestjs/common';

@Injectable()
export class SlackIntegrationService {
  public async sendNotification(channel: string, message: string): Promise<{ success: boolean; channel: string }> {
    console.log(`[SlackIntegration] Broadcast to channel #${channel}: "${message}"`);
    return { success: true, channel };
  }
}
