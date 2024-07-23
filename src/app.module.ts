import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CustomRoleModule } from './custom-role/custom-role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [require('./config/configuration')],
    }),
    DatabaseModule,
    CustomRoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
