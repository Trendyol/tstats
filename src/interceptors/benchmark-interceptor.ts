import { performance } from 'perf_hooks';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MeterService } from '../services/meter-service';
import { METRIC_PATH } from '../constants/constants';

@Injectable()
export class BenchmarkInterceptor implements NestInterceptor {
  private readonly meterService: MeterService;

  constructor(meterService: MeterService) {
    this.meterService = meterService;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const t1 = performance.now();
    const summary = this.meterService.createSummary(['method', 'url', 'service'], `Benchmark for ${this.meterService.getAppName()}`);
    const req = context.switchToHttp().getRequest();
    const path = req.route.path.substr(-1) === '/' ? req.route.path.slice(0, -1) : req.route.path;
    return next.handle().pipe(
      tap(() =>
        METRIC_PATH !== path
          ? summary.observe(
              {
                method: `${req.method}`,
                url: `${path}`,
                service: this.meterService.getAppName(),
              },
              performance.now() - t1
            )
          : null
      )
    );
  }
}
