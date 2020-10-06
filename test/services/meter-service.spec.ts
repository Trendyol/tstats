import { MeterService } from '../../src/services/meter-service';
import * as pClient from 'prom-client';

jest.mock('prom-client', () => ({
  Summary: jest.fn(),
  register: {
    metrics: jest.fn(),
  },
}));

describe('MeterService', () => {
  it('should return appName', () => {
    const namespace = 'namespace';
    const appName = 'appName';

    const meterService = new MeterService(namespace, appName);

    expect(meterService.getAppName()).toEqual(appName);
  });

  it('should create summary', () => {
    const namespace = 'namespace';
    const appName = 'appName';
    const labelNames = ['a'];
    const description = 'b';

    const meterService = new MeterService(namespace, appName);
    const summary = meterService.createSummary(labelNames, description);

    expect(pClient.Summary).toHaveBeenCalledWith({
      labelNames,
      name: namespace,
      help: description,
    });
    expect(summary).toBeInstanceOf(pClient.Summary);
  });

  it('should not create summary again', () => {
    const namespace = 'namespace';
    const appName = 'appName';
    const labelNames = ['a'];
    const description = 'b';

    const meterService = new MeterService(namespace, appName);
    const summary1 = meterService.createSummary(labelNames, description);
    const summary2 = meterService.createSummary([], '');

    expect(pClient.Summary).toHaveBeenCalledWith({
      labelNames,
      name: namespace,
      help: description,
    });
    expect(summary1).toBeInstanceOf(pClient.Summary);
    expect(summary2).toEqual(summary1);
  });

  it('should return metrics', async () => {
    const namespace = 'namespace';
    const appName = 'appName';

    const meterService = new MeterService(namespace, appName);
    await meterService.getMetrics();

    expect(pClient.register.metrics).toHaveBeenCalledTimes(1);
  });
});
