import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DataFactory, Seeder } from "nestjs-seeder"
import { User } from "./entities/user.entity";
import { Model } from "mongoose";

@Injectable()
export class UserSeeder implements Seeder {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }


    seed(): Promise<any> {
        const users = DataFactory.createForClass(User).generate(50)
        return this.userModel.insertMany(users)
    }

    drop(): Promise<any> {
        return this.userModel.deleteMany()
    }
}



