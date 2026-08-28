import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ProjectDetectorService } from './project-detector.service';
import { SymbolScannerService } from './symbol-scanner.service';
import { VSCodeIntegrationService } from './vscode-integration.service';
import { VSCodeOpenPayload } from '@atlas-os/shared';

@Controller('api/code')
export class CodeController {
  constructor(
    private readonly projectDetector: ProjectDetectorService,
    private readonly symbolScanner: SymbolScannerService,
    private readonly vscodeService: VSCodeIntegrationService
  ) {}

  @Post('detect-project')
  detectProject(@Body() body: { targetPath: string }) {
    const target = body.targetPath || process.cwd();
    const metadata = this.projectDetector.detectProject(target);
    return { success: true, metadata };
  }

  @Get('symbols')
  getSymbols(@Query('query') query = '') {
    const symbols = this.symbolScanner.searchSymbols(query);
    return { success: true, symbols };
  }

  @Post('open-vscode')
  async openVSCode(@Body() payload: VSCodeOpenPayload) {
    const result = await this.vscodeService.openInVSCode(payload);
    return result;
  }
}
