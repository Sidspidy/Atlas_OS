import { Controller, Post, Body } from '@nestjs/common';
import { VisionAnalyzerService } from './vision-analyzer.service';
import { ErrorDiagnosticsService } from './error-diagnostics.service';

@Controller('api/vision')
export class VisionController {
  constructor(
    private readonly visionAnalyzer: VisionAnalyzerService,
    private readonly errorDiagnostics: ErrorDiagnosticsService
  ) {}

  @Post('analyze')
  async analyzeScreen(@Body() body: { imageDataUrl: string }) {
    if (!body.imageDataUrl) {
      return { success: false, error: 'ImageDataUrl is required' };
    }
    const result = await this.visionAnalyzer.analyzeImage(body.imageDataUrl);
    return { success: true, result };
  }

  @Post('diagnose-error')
  diagnoseError(@Body() body: { snippets: string[] }) {
    const report = this.errorDiagnostics.diagnoseError(body.snippets || []);
    return { success: true, report };
  }
}
