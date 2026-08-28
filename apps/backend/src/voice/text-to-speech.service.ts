import { Injectable } from '@nestjs/common';
import { TTSRequestPayload } from '@atlas-os/shared';

@Injectable()
export class TextToSpeechService {
  public async synthesizeSpeech(payload: TTSRequestPayload): Promise<{ text: string; audioUrl?: string; synthesized: boolean }> {
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'tts-1',
            input: payload.text,
            voice: payload.voiceId || 'alloy',
            speed: payload.speed || 1.0
          })
        });

        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const base64Audio = Buffer.from(arrayBuffer).toString('base64');
          return {
            text: payload.text,
            audioUrl: `data:audio/mp3;base64,${base64Audio}`,
            synthesized: true
          };
        }
      } catch (e) {
        console.warn('[TextToSpeech] OpenAI TTS API call failed, using client Web Speech API:', e);
      }
    }

    // Client Web Speech API fallback signal
    return {
      text: payload.text,
      synthesized: false
    };
  }
}
