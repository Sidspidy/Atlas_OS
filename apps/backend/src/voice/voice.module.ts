import { Module } from '@nestjs/common';
import { WakeWordDetectorService } from './wake-word-detector.service';
import { SpeechToTextService } from './speech-to-text.service';
import { TextToSpeechService } from './text-to-speech.service';
import { VoiceController } from './voice.controller';

@Module({
  providers: [WakeWordDetectorService, SpeechToTextService, TextToSpeechService],
  controllers: [VoiceController],
  exports: [WakeWordDetectorService, SpeechToTextService, TextToSpeechService]
})
export class VoiceModule {}
