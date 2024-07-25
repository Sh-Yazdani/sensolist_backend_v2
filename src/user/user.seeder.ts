import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DataFactory, Seeder } from "nestjs-seeder"
import { User } from "./entities/user.entity";
import { Model } from "mongoose";

@Injectable()
export class UserSeeder implements Seeder {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }


    async seed(): Promise<any> {
        let users = DataFactory.createForClass(User).generate(5)

        const firstUser = new this.userModel(users.pop())
        await firstUser.save()

        users = users.map((user, index) => {
            return {
                ...user,
                creator: firstUser._id
            }
        })

        return this.userModel.insertMany(users)
    }

    drop(): Promise<any> {
        return this.userModel.deleteMany()
    }
}



