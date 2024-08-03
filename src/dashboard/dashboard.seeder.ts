import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DataFactory, Seeder } from "nestjs-seeder";
import { Dashboard } from "./entities/dashboard.entity";
import { Model } from "mongoose";

@Injectable()

export class DashboardSeeder implements Seeder {

    constructor(@InjectModel(Dashboard.name) private readonly dashboardModel: Model<Dashboard>) { }

    async seed(): Promise<any> {
        const dashes = DataFactory.createForClass(Dashboard).generate(4)

        return this.dashboardModel.insertMany(dashes)
    }
    async drop(): Promise<any> {
        return await this.dashboardModel.deleteMany()
    }

}


