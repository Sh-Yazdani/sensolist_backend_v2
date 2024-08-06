import { InjectModel } from "@nestjs/mongoose";
import { DataFactory, Seeder } from "nestjs-seeder";
import { Thing } from "./entities/thing.entity";
import { Model } from "mongoose";

export class ThingSeeder implements Seeder {

    realThings = [
        {
            name: "indoor 1",
            senderId: "sns00000001",
            chars: ["pm1", "pm2.5", "pm4", "pm10", "temperature", "humidity", "pressure", "co2", "vnc"]
        },
        {
            name: "indoor 2",
            senderId: "sns00000002",
            chars: ["pm1", "pm2.5", "pm4", "pm10", "temperature", "humidity", "pressure", "co2", "vnc", "nox", "lux", "noise"]
        },
        {
            name: "outdoor 1",
            senderId: "sns00000003",
            chars: ["pm1", "pm2.5", "pm4", "pm10", "temperature", "humidity", "pressure"]
        }
    ]

    constructor(@InjectModel(Thing.name) private readonly thingModel: Model<Thing>) { }

    seed(): Promise<any> {
        let things = DataFactory.createForClass(Thing).generate(3)

        things = things.map((thing, index) => {
            return {
                ...thing,
                senderId: this.realThings[index].senderId,
                brand: index % 5 == 0 ? null : thing.brand,
                model: index % 5 == 0 ? null : `${thing.model}${index + 1}`,
                name: this.realThings[index].name,
                type: `${thing.type}${index + 1}`,
                characteristics: this.realThings[index].chars
            }
        })

        return this.thingModel.insertMany(things)
    }
    drop(): Promise<any> {
        return this.thingModel.deleteMany()
    }

}


