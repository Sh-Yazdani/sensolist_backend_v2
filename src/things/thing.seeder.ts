import { InjectModel } from "@nestjs/mongoose";
import { DataFactory, Seeder } from "nestjs-seeder";
import { Thing } from "./entities/thing.entity";
import { Model } from "mongoose";

export class ThingSeeder implements Seeder {

    constructor(@InjectModel(Thing.name) private readonly thingModel: Model<Thing>) { }

    seed(): Promise<any> {
        const things = DataFactory.createForClass(Thing).generate(15)
        return this.thingModel.insertMany(things)
    }
    drop(): Promise<any> {
        return this.thingModel.deleteMany()
    }

}


