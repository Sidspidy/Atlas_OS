import { Injectable } from '@nestjs/common';
import { WakeWordStatus } from '@atlas-os/shared';

@Injectable()
export class WakeWordDetectorService {
  private active = true;
  private sensitivity = 0.85;

  public detectWakeWord(transcriptOrAudioText: string): { detected: boolean; cleanedText: string } {
    if (!this.active) return { detected: false, cleanedText: transcriptOrAudioText };

    const lower = transcriptOrAudioText.toLowerCase();
    const wakePhrases = ['hey atlas', 'atlas', 'okay atlas', 'hi atlas'];

    for (const phrase of wakePhrases) {
      if (lower.includes(phrase)) {
        const cleaned = transcriptOrAudioText.replace(new RegExp(phrase, 'gi'), '').trim();
        return { detected: true, cleanedText: cleaned };
      }
    }

    return { detected: false, cleanedText: transcriptOrAudioText };
  }

  public getStatus(): WakeWordStatus {
    return {
      active: this.active,
      phrase: 'Hey Atlas',
      sensitivity: this.sensitivity
    };
  }

  public setSensitivity(sensitivity: number): void {
    this.sensitivity = Math.max(0.1, Math.min(1.0, sensitivity));
  }
}
