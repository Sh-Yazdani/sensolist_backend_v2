import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CustomRoleModule } from './custom-role/custom-role.module';
import { UserModule } from './user/user.module';
import { ThingsModule } from './things/things.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [require('./config/configuration')],
    }),
    DatabaseModule,
    CustomRoleModule,
    UserModule,
    ThingsModule,
    AppModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
