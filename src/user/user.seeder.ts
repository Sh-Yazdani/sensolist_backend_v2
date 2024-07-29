import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DataFactory, Seeder } from "nestjs-seeder"
import { User } from "./entities/user.entity";
import { Model } from "mongoose";
import { SystemRoles } from "../enums/role.enum";
import { UserService } from "./user.service";
import { CustomRoleService } from "../custom-role/custom-role.service";

@Injectable()
export class UserSeeder implements Seeder {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @Inject() private readonly userService: UserService,
        @Inject() private readonly customRoleService: CustomRoleService,
    ) { }


    async seed(): Promise<any> {
        let users = DataFactory.createForClass(User).generate(5)
        let customRoles = await this.customRoleService.getRoles()

        const admin = new this.userModel(users.pop())
        admin.systemRole = SystemRoles.Admin
        admin.phonenumber = "+989151234567"
        admin.passwordHash = await this.userService.hashData("123456")
        await admin.save()


        users = users.map((user, index) => {
            return {
                ...user,
                customRoleId: customRoles[0]._id,
                creator: admin._id,
            }
        })

        return this.userModel.insertMany(users)
    }

    drop(): Promise<any> {
        return this.userModel.deleteMany()
    }
}



