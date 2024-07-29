import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileEntity } from './entities/sl-file.entity';
import { Response, response } from 'express';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('files')
@ApiTags("files")
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post('temp/img/:fileEntity')
  @ApiOperation({ summary: "up;oading a file", description: "using for uploading files like things images, this api store files and return a fileID then you can use this id for creating a entity like thing" })
  @ApiParam({ name: "fileEntity", enum: FileEntity })
  @UseInterceptors(FileInterceptor("file"))
  async create(@Param("fileEntity") entity: FileEntity, @UploadedFile("file") image: Express.Multer.File) {
    return this.fileService.storeTempImage(entity, image)
  }

  @Get(":id")
  @ApiOperation({ summary: "fetching files", description: "use this route for fetching files like thing image" })
  @ApiParam({ name: "id", type: String })
  async get(@Param("id") fileId: string, @Res({ passthrough: false }) response: Response) {
    this.fileService.moveFiles([fileId])
    return this.fileService.serveFile(fileId, response)
  }

}
