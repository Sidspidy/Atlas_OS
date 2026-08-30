import { Controller, Post, Get, Body } from '@nestjs/common';
import { ModelRouterService } from './model-router.service';
import { PdfService } from './pdf-service';
import { ImageGenService } from './image-gen.service';

@Controller('api/ai')
export class AIController {
  constructor(
    private readonly modelRouter: ModelRouterService,
    private readonly pdfService: PdfService,
    private readonly imageGenService: ImageGenService
  ) {}

  @Post('chat')
  public async chat(@Body() body: { query: string; context?: string }) {
    const text = await this.modelRouter.generateCompletion(body.query, body.context);
    return {
      success: true,
      message: {
        id: `msg_${Date.now()}`,
        sender: 'atlas',
        text,
        timestamp: new Date().toLocaleTimeString()
      }
    };
  }

  @Get('pdf-files')
  public getPdfFiles() {
    const pdfs = this.pdfService.getLocalPdfFiles();
    return { success: true, pdfs };
  }

  @Post('analyze-pdf')
  public analyzePdf(@Body() body: { filePath: string }) {
    const analysis = this.pdfService.analyzePdfContent(body.filePath);
    return { success: true, analysis };
  }

  @Post('generate-image')
  public generateImage(@Body() body: { prompt: string; width?: number; height?: number }) {
    const imageUrl = this.imageGenService.generateImageUrl(body.prompt, body.width, body.height);
    return { success: true, imageUrl, prompt: body.prompt };
  }
}
