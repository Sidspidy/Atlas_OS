import { Controller, Post, Get, Body } from '@nestjs/common';
import { WakeWordDetectorService } from './wake-word-detector.service';
import { SpeechToTextService } from './speech-to-text.service';
import { TextToSpeechService } from './text-to-speech.service';
import { TTSRequestPayload } from '@atlas-os/shared';

@Controller('api/voice')
export class VoiceController {
  constructor(
    private readonly wakeWordDetector: WakeWordDetectorService,
    private readonly sttService: SpeechToTextService,
    private readonly ttsService: TextToSpeechService
  ) {}

  @Post('transcribe')
  async transcribe(@Body() body: { audioPayload: string }) {
    if (!body.audioPayload) {
      return { success: false, error: 'Audio payload is required' };
    }
    const transcript = await this.sttService.transcribeAudio(body.audioPayload);
    const wakeWordResult = this.wakeWordDetector.detectWakeWord(transcript.text);

    return {
      success: true,
      transcript,
      wakeWordDetected: wakeWordResult.detected,
      cleanedText: wakeWordResult.cleanedText
    };
  }

  @Post('synthesize')
  async synthesize(@Body() body: TTSRequestPayload) {
    if (!body.text) {
      return { success: false, error: 'Text is required for TTS' };
    }
    const result = await this.ttsService.synthesizeSpeech(body);
    return { success: true, ...result };
  }

  @Get('status')
  getStatus() {
    return {
      success: true,
      wakeWord: this.wakeWordDetector.getStatus()
    };
  }
}
