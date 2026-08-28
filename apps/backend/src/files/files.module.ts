import { Module } from '@nestjs/common';
import { TextExtractorService } from './text-extractor.service';
import { FileIndexerService } from './file-indexer.service';
import { FilesController } from './files.controller';

@Module({
  providers: [TextExtractorService, FileIndexerService],
  controllers: [FilesController],
  exports: [TextExtractorService, FileIndexerService]
})
export class FilesModule {}
