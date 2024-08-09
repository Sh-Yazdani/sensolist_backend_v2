import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import { UploadTempFileResponseDTO } from './dto/file-entity.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FileEntity, SLFile } from './entities/sl-file.entity';
import { Model, ObjectId, Types } from 'mongoose';
import { writeFile, rename } from "fs/promises";
import { join } from 'path';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { completeThePath, createFoldersIfNotExists } from '../utils/utils';

@Injectable()
export class FileService {

  constructor(@InjectModel(SLFile.name) private readonly fileModel: Model<SLFile>) { }

  async writeFileIntoStorage(file: Buffer, fileEntity: SLFile): Promise<void> {
    const filename = join(fileEntity.dir, `${fileEntity._id}.${fileEntity.extension}`)
    await writeFile(filename, file)
  }

  async storeFileInfo(entity: FileEntity, originalname: string, mime: string): Promise<SLFile> {
    const dirs = ["public", "images", "things", "temp"]

    createFoldersIfNotExists(dirs)

    //absolote path of destination directory
    const dirPath = completeThePath(dirs)

    const extension = originalname.split(".").reverse()[0]

    const imageEntity = new this.fileModel({
      entity: entity,
      extension: extension,
      mime: mime,
      dir: dirPath
    })

    return await imageEntity.save()
  }

  async getFileInfo(fileId: string): Promise<SLFile | undefined> {
    const file = await this.fileModel.findOne({ _id: fileId }).exec()

    if (!file)
      return undefined

    return file
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

