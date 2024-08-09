import { Seeder } from "nestjs-seeder";
import { ImageModel } from "src/things/dto/create-thing.dto";
import { FileEntity, SLFile } from "./entities/sl-file.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { readFile } from "fs/promises";
import { completeThePath } from "src/utils/utils";
import { FileService } from "./file.service";

export class FileSeeder implements Seeder {

    dirPath: string

    constructor(
        @InjectModel(SLFile.name) private readonly fileModel: Model<SLFile>,
        private readonly fileService: FileService
    ) {
        const dirs = ["public", "images", "things"]
        this.dirPath = completeThePath(dirs)
    }


    seed(): Promise<any> {

        const filesName = ["indoor1-1", "indoor1-2", "indoor1-3", "indoor1-4", "indoor1-5", "indoor2-1", "indoor2-2", "outdoor1-1", "outdoor1-2"]

        for (let fileName of filesName) {
            const file = await readFile(completeThePath([this.dirPath, `${fileName}.jpg`]))
            const fileInfo = await this.fileService.storeFileInfo(FileEntity.Thing, fileName, "image/jpg")
            this.fileService.writeFileIntoStorage(file, fileInfo)
        }

        return void
    }
    drop(): Promise<any> {
        throw new Error("Method not implemented.");
    }
}

