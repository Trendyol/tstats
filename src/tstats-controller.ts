import { Controller, Get } from '@nestjs/common';
import { MeterService } from './services/meter-service';
import { METRIC_PATH } from './constants/constants';

@Controller()
export class TstatsController {
  private readonly meterService: MeterService;

  constructor(meterService: MeterService) {
    this.meterService = meterService;
  }

  @Get(METRIC_PATH)
  public async metrics() {
    return await this.meterService.getMetrics();
  }
}
