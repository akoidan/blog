---
title: "Use NestJS modules wisely"
description: "Are you sure you know Dependency Injections principle?"
date: "26 August 2023"
draft: true
tags: 
 - nestjs
 - patterns
 - typescript
---

## Prelude
Building huge applications could be hard. Especially if you follow simple principles incorrectly. But this could be easily avoided by using simple rules.
 - Do not use `new` keyword anywhere in the code. NestJS is an IOC (Inversion of Control) container, and this means that it will provide this for you.
 - Do not import object instance, configs, constants to your code. Again lets use dependency injection for this.
 - Incapsulate logic inside your services and modules, allowing easy using of your code.
 - 
Lets dive into example and see how we can fix this. Lets say we are building Crypto Tron Api wrapper, that gets information about your crypto asset.
 
```typescript
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { Tron } from 'node-config-ts';

/**
 * This service provides http API to tronweb network.
 * It should not depend in any crypto tools or anything else. Just a simple provider.
 * */
@Injectable()
export default class TronWebService {
  private readonly axiosRequestConfig: AxiosRequestConfig;
  private readonly baseUrl = 'https://api.trongrid.io';

  public constructor(
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    config: Tron,
  ) {
    this.axiosRequestConfig = {
      baseURL: config.url,
      headers: {
        'TRON-PRO-API-KEY': config.apiKey,
      },
    };
  }

  async getAccountResource(hexAddress: string): Promise<ITronGetAccountResourcesResponse> {
    const params = { ...this.axiosRequestConfig, params: { address: hexAddress } };
    const http = await this.httpService.get('/wallet/getaccountresource', params).toPromise();
    return http?.data;
  }

  async getTronBlock(): Promise<ITronGetBlockResponse> {
    const http = await this.httpService.get('/wallet/getblock', this.axiosRequestConfig).toPromise();
    return http?.data;
  }
}

```


```typescript
@Module({
  imports: [HttpModule, LoggerModule, AuthModule, DatabaseModule],
  controllers: [TronController],
  providers: [
    TronService,
    {
      provide: Tron,
      useFactory: (): Tron => CryptoFactory.getTrx(),
    },
    {
      provide: TronWebService,
      inject: [LoggerService, HttpService],
      useFactory: (logger, httpService): TronWebService => new TronWebService(logger, httpService, config.services.tron),
    },
  ],
  exports: [TronWebService],
})
export class TronModule {
  
}
```
