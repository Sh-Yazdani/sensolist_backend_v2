import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileEntity } from './entities/sl-file.entity';
import { Response, response } from 'express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UploadTempFileResponseDTO } from './dto/file-entity.dto';
import { ErrorResponseDTO } from '../dto/response.dto';

@Controller('files')
@ApiTags("files")
@ApiBearerAuth("access_token")
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post('temp/img/:fileEntity')
  @ApiOperation({ summary: "uploading a file", description: "using for uploading files like things images, this api store files and return a fileID then you can use this id for creating a entity like thing" })
  @ApiParam({ name: "fileEntity", enum: FileEntity, description: "the entity you want to upload a file for it" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: UploadTempFileResponseDTO })
  @ApiBadRequestResponse({ type: ErrorResponseDTO })
  @UseInterceptors(FileInterceptor("file"))
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async create(@Param("fileEntity") entity: FileEntity, @UploadedFile("file") file: Express.Multer.File) {
    return this.fileService.storeTempImage(entity, file)
  }

  @Get(":id")
  @ApiOperation({ summary: "fetching files", description: "use this route for fetching files like thing image" })
  @ApiParam({ name: "id", type: String, description: "file id you receive this on uploading file route" })
  @ApiInternalServerErrorResponse({ type: ErrorResponseDTO })
  async get(@Param("id") fileId: string, @Res({ passthrough: false }) response: Response) {
    return this.fileService.serveFile(fileId, response)
  }

}
