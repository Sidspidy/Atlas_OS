import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageGenService {
  public generateImageUrl(prompt: string, width: number = 1024, height: number = 1024): string {
    const encodedPrompt = encodeURIComponent(prompt);
    // Pollinations AI high-speed image generation URL
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
  }
}
