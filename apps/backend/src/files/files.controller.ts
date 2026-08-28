import { Controller, Get, Post, Body } from '@nestjs/common';
import { FileIndexerService } from './file-indexer.service';

@Controller('api/files')
export class FilesController {
  constructor(private readonly indexerService: FileIndexerService) {}

  @Post('index-directory')
  async indexDirectory(@Body() body: { directoryPath: string }) {
    if (!body.directoryPath) {
      return { success: false, error: 'directoryPath is required' };
    }
    const scope = await this.indexerService.indexDirectory(body.directoryPath);
    return { success: true, scope, stats: this.indexerService.getStats() };
  }

  @Get('indexed')
  getIndexedFiles() {
    return {
      files: this.indexerService.getIndexedFiles(),
      directories: this.indexerService.getDirectoryScopes()
    };
  }

  @Get('stats')
  getStats() {
    return this.indexerService.getStats();
  }
}
