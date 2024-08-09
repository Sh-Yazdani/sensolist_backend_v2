import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CheckSystemRole } from './decorator/role.decorator';
import { SystemRoles } from './enums/role.enum';
import { ApiBearerAuth, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import { ProxyModel } from './main.dto';
import { Observable } from 'rxjs';

@Controller('')
@CheckSystemRole([SystemRoles.Admin, SystemRoles.NonAdmin])
@ApiBearerAuth("access_token")
export class AppController {

  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("proxy")
  @ApiOperation({ summary: "mqtt proxy" })
  async create(@Req() request: Request, @Body() data: ProxyModel): Promise<any> {

    const result = await this.httpService.axiosRef.post("http://www.sensolisttech.com:3123/api/data", data,
      {
        headers: {
          "Content-Type": request.headers['content-type'],
          "Authorization": request.headers["authorization"]
        }
      }
    )

    return result.data
  }

  // temp() {
  //   const res = await fetch("https://www.sensolisttech.com:3123/api/data", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       sender_id: senderId,
  //       characteristics: charactristics,
  //       page: 1,
  //       limit: 10,
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${session?.accessToken}`,
  //     },
  //   })
  // }

}
