import { InjectModel } from "@nestjs/mongoose";
import { DataFactory, Seeder } from "nestjs-seeder";
import { Thing } from "./entities/thing.entity";
import { Model } from "mongoose";

export class ThingSeeder implements Seeder {

    constructor(@InjectModel(Thing.name) private readonly thingModel: Model<Thing>) { }

    seed(): Promise<any> {
        let things = DataFactory.createForClass(Thing).generate(15)

        things = things.map((thing, index) => {
            return {
                ...thing,
                brand: index % 5 == 0 ? null : thing.brand ,
                model:index % 5 == 0 ? null : `${thing.model}${++index}`,
                name:`${thing.name} ${++index}`,
                type:`${thing.type}${++index}`,
            }
        })

        return this.thingModel.insertMany(things)
    }
    drop(): Promise<any> {
        return this.thingModel.deleteMany()
    }

}


