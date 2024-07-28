import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { SLFile, slFileSchema } from './entities/sl-file.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: SLFile.name, schema: slFileSchema }])],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule { }
