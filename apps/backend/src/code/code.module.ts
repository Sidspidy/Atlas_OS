import { Module } from '@nestjs/common';
import { ProjectDetectorService } from './project-detector.service';
import { SymbolScannerService } from './symbol-scanner.service';
import { VSCodeIntegrationService } from './vscode-integration.service';
import { CodeController } from './code.controller';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  providers: [ProjectDetectorService, SymbolScannerService, VSCodeIntegrationService],
  controllers: [CodeController],
  exports: [ProjectDetectorService, SymbolScannerService, VSCodeIntegrationService]
})
export class CodeModule {}
