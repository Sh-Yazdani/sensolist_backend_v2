import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DataFactory, Seeder } from "nestjs-seeder";
import { Applet } from "./entities/applet.entity";
import { Model } from "mongoose";

@Injectable()
export class AppletSeeder implements Seeder{

    constructor(@InjectModel(Applet.name) private readonly appletModel: Model<Applet>){}

    async seed(): Promise<any> {
        const applets = DataFactory.createForClass(Applet).generate(5)

        return this.appletModel.insertMany(applets)

    }
    async drop(): Promise<any> {
        return this.appletModel.deleteMany()
    }



}

