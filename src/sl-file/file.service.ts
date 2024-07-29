import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import { UploadTempFileResponseDTO } from './dto/file-entity.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FileEntity, SLFile } from './entities/sl-file.entity';
import { Model } from 'mongoose';
import { writeFile, rename } from "fs/promises";
import { join } from 'path';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { completeThePath, createFoldersIfNotExists } from '../utils/utils';

@Injectable()
export class FileService {

  constructor(@InjectModel(SLFile.name) private readonly fileModel: Model<SLFile>) { }

  async storeTempImage(entity: FileEntity, image: Express.Multer.File): Promise<UploadTempFileResponseDTO> {

    if (!image)
      throw new BadRequestException("file not valid")

    const imageExtension = image.originalname.split(".").reverse()[0]
    const dirs = ["public", "images", "things", "temp"]

    createFoldersIfNotExists(dirs)

    const dirPath = completeThePath(dirs)

    const imageEntity = new this.fileModel({
      entity: entity,
      extension: imageExtension,
      mime: image.mimetype,
      dir: dirPath
    })

    await imageEntity.save()


    await writeFile(join(dirPath, `${imageEntity._id}.${imageExtension}`), image.buffer)

    return {
      statusCode: 201,
      fileId: imageEntity._id
    }

  }

  async serveFile(fileId: string, response: Response) {

    const file = await this.fileModel.findOne({ _id: fileId }).exec()

    response.set("Content-Type", file.mime)

    const stream = createReadStream(join(file.dir, `${file._id}.${file.extension}`))

    stream.pipe(response)

  }

  async moveFiles(fileIds: string[]) {

    const files = await this.fileModel.find({ _id: { $in: fileIds } }).exec()

    for (let file of files) {
      const fileName = `${file._id}.${file.extension}`
      const permanentPath = join(file.dir, "..", fileName)
      const tempPath = join(file.dir, fileName)

      await rename(tempPath, permanentPath)
      file.temp = false
      await file.save()
    }

  }

}

