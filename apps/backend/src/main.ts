import fs from 'fs';
import path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Auto-load .env from root workspace
const rootEnvPath = path.resolve(__dirname, '../../../.env');
if (fs.existsSync(rootEnvPath)) {
  const envContent = fs.readFileSync(rootEnvPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valParts] = trimmed.split('=');
      if (key && valParts.length > 0) {
        const val = valParts.join('=').trim().replace(/^["']|["']$/g, '');
        process.env[key.trim()] = val;
      }
    }
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`[Atlas OS Backend] Operational on http://localhost:${port}`);
  if (process.env.GEMINI_API_KEY) {
    console.log(`[Atlas OS Backend] Google Gemini Pro API Key Loaded (${process.env.GEMINI_API_KEY.slice(0, 6)}...${process.env.GEMINI_API_KEY.slice(-4)})`);
  }
}
bootstrap();
