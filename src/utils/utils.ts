import { existsSync, mkdirSync } from "fs"
import {dirname, join} from "path"

export function completeThePath(paths:string[]) {
    const rootPath = dirname(process.mainModule.filename)
    const resultPath = join(...[rootPath, ...paths])
    return resultPath
}

export function createFoldersIfNotExists(folders:string[]) {

    let path = completeThePath(folders)

    if (existsSync(path))
        return

    for (let i = 0; i < folders.length; ++i) {
        path = completeThePath((folders.slice(0, i + 1)))

        if (!existsSync(path))
            mkdirSync(path)

    }

}
