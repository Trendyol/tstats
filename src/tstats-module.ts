import { DynamicModule, Module, RequestMethod, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MeterService } from './services/meter-service';
import { TstatsOptions } from './model/tstats-options';
import { BenchmarkInterceptor } from './interceptors/benchmark-interceptor';
import { TstatsController } from './tstats-controller';
import { ZipkinService } from './services/zipkin-service';

@Module({})
export class TstatsModule implements NestModule {
  private static zipkinServiceInstance: ZipkinService;

  public static register(options: TstatsOptions): DynamicModule {
    if (options.enabled) {
      TstatsModule.zipkinServiceInstance = new ZipkinService(options.zipkin);
    }
    return {
      module: TstatsModule,
      controllers: options.enabled ? [TstatsController] : [],
      imports: [],
      ...(options.enabled
        ? {
            providers: [
              {
                provide: MeterService,
                useFactory: () => new MeterService(options.namespace, options.appName),
              },
              {
                provide: ZipkinService,
                useFactory: () => TstatsModule.zipkinServiceInstance,
              },
              {
                provide: APP_INTERCEPTOR,
                useClass: BenchmarkInterceptor,
              },
            ],
          }
        : { providers: [] }),
      exports: [],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TstatsModule.zipkinServiceInstance.getMiddleware()).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
