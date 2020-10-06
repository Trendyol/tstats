import { BatchRecorder, Tracer, ExplicitContext, jsonEncoder } from 'zipkin';
import { ZipkinService } from '../../src/services/zipkin-service';
import { expressMiddleware } from 'zipkin-instrumentation-express';
import { HttpLogger } from 'zipkin-transport-http';
import { ZipkinOptions } from '../../src/model/zipkin-options';

jest.mock('zipkin', () => ({
  BatchRecorder: jest.fn(),
  Tracer: jest.fn(),
  ExplicitContext: jest.fn(),
  jsonEncoder: {
    JSON_V2: '',
  },
}));

jest.mock('zipkin-instrumentation-express', () => ({
  expressMiddleware: jest.fn(),
}));

jest.mock('zipkin-transport-http', () => ({
  HttpLogger: jest.fn(),
}));

describe('ZipkinService', () => {
  it('should create without options', () => {
    const _ = new ZipkinService();

    expect(BatchRecorder).toHaveBeenCalledTimes(0);
    expect(Tracer).toHaveBeenCalledTimes(0);
    expect(ExplicitContext).toHaveBeenCalledTimes(0);
  });

  it('should create with options', () => {
    const options: ZipkinOptions = {
      url: 'url',
      serviceName: 'serviceName',
    };
    const _ = new ZipkinService(options);

    expect(HttpLogger).toHaveBeenCalledWith({
      endpoint: options.url,
      jsonEncoder: jsonEncoder.JSON_V2,
    });
    expect(ExplicitContext).toHaveBeenCalledTimes(1);
    expect(BatchRecorder).toHaveBeenCalledTimes(1);
    expect(Tracer).toHaveBeenCalledTimes(1);
  });

  it('should return tracer', () => {
    const options: ZipkinOptions = {
      url: 'url',
      serviceName: 'serviceName',
    };
    const zipkinService = new ZipkinService(options);

    expect(zipkinService.getTracer()).toBeInstanceOf(Tracer);
  });

  it('should return middleware', () => {
    const options: ZipkinOptions = {
      url: 'url',
      serviceName: 'serviceName',
    };
    const zipkinService = new ZipkinService(options);
    zipkinService.getMiddleware();

    expect(expressMiddleware).toHaveBeenCalledTimes(1);
  });
});
