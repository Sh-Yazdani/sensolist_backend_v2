import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CustomRoleModule } from './custom-role/custom-role.module';
import { UserModule } from './user/user.module';
import { ThingsModule } from './things/things.module';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthenticationGuard } from './guard/auth.guard';
import { AccessTokenModule } from './auth/access-token.module';
import { SystemRoleGuard } from './guard/system-role.guard';
import { FileModule } from './sl-file/file.module';
import { UserPermissionModule } from './user-permission/user-permission.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AppletModule } from './applet/applet.module';
import { WidgetModule } from './widget/widget.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'node_modules', 'swagger-ui-dist')
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    AuthModule,
    CustomRoleModule,
    UserModule,
    ThingsModule,
    AccessTokenModule,
    FileModule,
    UserPermissionModule,
    DashboardModule,
    AppletModule,
    WidgetModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: "APP_GUARD",
      useClass: AuthenticationGuard
    },
    {
      provide: "APP_GUARD",
      useClass: SystemRoleGuard
    },
    AppService
  ],
})
export class AppModule { }
