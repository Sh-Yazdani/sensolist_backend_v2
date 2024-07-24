import { seeder } from "nestjs-seeder";
import { UserSeeder } from "./user/user.seeder";
import { DatabaseModule } from "./database/database.module";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user/entities/user.entity";

seeder(
    {
        imports: [
            DatabaseModule,
            MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
        ]
    }
).run([UserSeeder])



