import { Injectable } from '@nestjs/common';
import { CredentialVaultItem } from '@atlas-os/shared';
import * as crypto from 'crypto';

@Injectable()
export class CredentialVaultService {
  private vault: Map<string, CredentialVaultItem> = new Map();
  private secretKey: Buffer;

  constructor() {
    this.secretKey = crypto.scryptSync('atlas-os-master-passphrase', 'salt', 32);
    this.seedDefaultCredentials();
  }

  public storeCredential(key: string, provider: string, rawValue: string): CredentialVaultItem {
    const encryptedValue = this.encrypt(rawValue);
    const item: CredentialVaultItem = {
      key,
      provider,
      encryptedValue,
      updatedAt: new Date().toISOString()
    };
    this.vault.set(key, item);
    return item;
  }

  public getVaultItems(): CredentialVaultItem[] {
    return Array.from(this.vault.values());
  }

  public encrypt(text: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  private seedDefaultCredentials() {
    this.storeCredential('OPENAI_API_KEY', 'OpenAI Cloud', 'sk-proj-demo-encrypted-vault-key');
    this.storeCredential('GITHUB_TOKEN', 'GitHub OAuth', 'ghp_demoEncryptedToken123456');
    this.storeCredential('SLACK_WEBHOOK_URL', 'Slack App', 'https://hooks.slack.com/services/demo');
  }
}
