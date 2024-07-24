import { seeder } from "nestjs-seeder";
import { UserSeeder } from "./user/user.seeder";
import { DatabaseModule } from "./database/database.module";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user/entities/user.entity";
import { CustomRole, CustomRoleSchema } from "./custom-role/entities/custom-role.entity";
import { CustomRoleSeeder } from "./custom-role/custom-role.seeder";
import { Thing, ThingSchema } from "./things/entities/thing.entity";
import { ThingSeeder } from "./things/thing.seeder";

seeder(
    {
        imports: [
            DatabaseModule,
            MongooseModule.forFeature([
                { name: User.name, schema: UserSchema },
                { name: CustomRole.name, schema: CustomRoleSchema },
                { name: Thing.name, schema: ThingSchema },
            ])
        ]
    }
).run([
    UserSeeder,
    CustomRoleSeeder,
    ThingSeeder
])



