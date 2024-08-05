import { InjectModel } from "@nestjs/mongoose";
import { DataFactory, Seeder } from "nestjs-seeder";
import { Thing } from "./entities/thing.entity";
import { Model } from "mongoose";

export class ThingSeeder implements Seeder {

    characteristics = [
        {
            name: "temperature",
            sender_id: "sns0000001"

        },
        {
            name: "humidity",
            sender_id: "sns0000002"

        },
        {
            name: "CO2 measurement",
            sender_id: "sns0000003"

        },
        {
            name: "PM measurement",
            sender_id: "sns0000004"

        }
    ]

    constructor(@InjectModel(Thing.name) private readonly thingModel: Model<Thing>) { }

    seed(): Promise<any> {
        let things = DataFactory.createForClass(Thing).generate(4)

        things = things.map((thing, index) => {
            return {
                ...thing,
                brand: index % 5 == 0 ? null : thing.brand,
                model: index % 5 == 0 ? null : `${thing.model}${index + 1}`,
                name: `${thing.name} ${index + 1}`,
                type: `${thing.type}${index + 1}`,
                characteristics: this.characteristics[index]
            }
        })

        return this.thingModel.insertMany(things)
    }
    drop(): Promise<any> {
        return this.thingModel.deleteMany()
    }

}


