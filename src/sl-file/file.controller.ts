import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileEntity } from './entities/sl-file.entity';
import { Response, response } from 'express';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post('temp/img/:fileEntity')
  @UseInterceptors(FileInterceptor("file"))
  async create(@Param("fileEntity") entity: FileEntity, @UploadedFile("file") image: Express.Multer.File) {
    return this.fileService.storeTempImage(entity, image)
  }

  @Get(":id")
  async get(@Param("id") fileId: string, @Res() response: Response) {
    this.fileService.moveFiles([fileId])
    return this.fileService.serveFile(fileId, response)
  }

}
