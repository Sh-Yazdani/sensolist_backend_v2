import { InjectModel } from "@nestjs/mongoose";
import { DataFactory, Seeder } from "nestjs-seeder";
import { CustomRole } from "./entities/custom-role.entity";
import { Model } from "mongoose";

export class CustomRoleSeeder implements Seeder {

    constructor(@InjectModel(CustomRole.name) private readonly roleModel: Model<CustomRole>) { }

    seed(): Promise<any> {
        let roles = DataFactory.createForClass(CustomRole).generate(8)

        roles = roles.map((role, index) => {
            return {
                ...role,
                name: `${role.name} ${++index}`
            }
        })

        return this.roleModel.insertMany(roles)
    }
    drop(): Promise<any> {
        return this.roleModel.deleteMany()
    }
}



