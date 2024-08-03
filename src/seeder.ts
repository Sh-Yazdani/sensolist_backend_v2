import { seeder } from "nestjs-seeder";
import { UserSeeder } from "./user/user.seeder";
import { DatabaseModule } from "./database/database.module";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user/entities/user.entity";
import { CustomRole, CustomRoleSchema } from "./custom-role/entities/custom-role.entity";
import { CustomRoleSeeder } from "./custom-role/custom-role.seeder";
import { Thing, ThingSchema } from "./things/entities/thing.entity";
import { ThingSeeder } from "./things/thing.seeder";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { UserModule } from "./user/user.module";
import { CustomRoleModule } from "./custom-role/custom-role.module";
import { DashboardSeeder } from "./dashboard/dashboard.seeder";
import { Dashboard, DashboardSchema } from "./dashboard/entities/dashboard.entity";

seeder(
    {
        imports: [
            ConfigModule.forRoot({
                load: [configuration],
                isGlobal: true,
              }),
            DatabaseModule,
            MongooseModule.forFeature([
                { name: User.name, schema: UserSchema },
                { name: CustomRole.name, schema: CustomRoleSchema },
                { name: Thing.name, schema: ThingSchema },
                { name: Dashboard.name, schema: DashboardSchema },
            ]),
            UserModule,
            CustomRoleModule
        ]
    }
).run([
    CustomRoleSeeder,
    UserSeeder,
    ThingSeeder,
    DashboardSeeder
])



