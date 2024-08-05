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
import { Applet, AppletSchema } from "./applet/entities/applet.entity";
import { AppletSeeder } from "./applet/applet.seeder";
import { WidgetSeeder } from "./widget/widget.seeder";
import { RawWidget, rawWidgetSchema } from "./widget/entities/raw-widget.entity";
import { WidgetGroup, widgetGroupSchema } from "./widget/entities/widget-group.entity";
import { WidgetConfig, widgetConfigSchema } from "./widget/entities/widget-config.entity";

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
                { name: Applet.name, schema: AppletSchema },
                { name: RawWidget.name, schema: rawWidgetSchema },
                { name: WidgetGroup.name, schema: widgetGroupSchema },
                { name: WidgetConfig.name, schema: widgetConfigSchema },
            ]),
            UserModule,
            CustomRoleModule
        ]
    }
).run([
    CustomRoleSeeder,
    UserSeeder,
    ThingSeeder,
    DashboardSeeder,
    AppletSeeder,
    WidgetSeeder
])



