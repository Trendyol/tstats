import { deepEqual, instance, mock, reset, verify, when } from 'ts-mockito';
import { MeterService } from '../../src/services/meter-service';
import { BenchmarkInterceptor } from '../../src/interceptors/benchmark-interceptor';
import { tap } from 'rxjs/operators';

jest.mock('rxjs/operators', () => ({
  tap: jest.fn((cb) => cb()),
}));

describe('BenchmarkInterceptor', () => {
  const mockMeterService = mock(MeterService);

  afterEach(() => {
    reset(mockMeterService);
  });

  it('should call interceptor', () => {
    const benchmarkInterceptor = new BenchmarkInterceptor(instance(mockMeterService));

    const executionContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({
          route: {
            path: 'req-path',
          },
          method: 'get',
        })),
      })),
    };
    const next = { handle: jest.fn(() => ({ pipe: jest.fn() })) };

    const mockSummary = { observe: jest.fn() };

    when(mockMeterService.getAppName()).thenReturn('appName');
    when(mockMeterService.createSummary(deepEqual(['method', 'url', 'service']), `Benchmark for ${'appName'}`)).thenReturn(mockSummary);

    benchmarkInterceptor.intercept(executionContext as any, next as any);

    verify(mockMeterService.getAppName()).twice();
    verify(mockMeterService.createSummary(deepEqual(['method', 'url', 'service']), `Benchmark for ${'appName'}`)).once();
    expect(tap).toHaveBeenCalledTimes(1);
    expect(mockSummary.observe).toHaveBeenCalledWith(
      {
        method: `get`,
        url: `req-path`,
        service: 'appName',
      },
      expect.anything()
    );
  });
});
