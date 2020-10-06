import { ZipkinOptions } from '../model/zipkin-options';
import { BatchRecorder, Tracer, ExplicitContext, jsonEncoder } from 'zipkin';
import { HttpLogger } from 'zipkin-transport-http';
import { expressMiddleware } from 'zipkin-instrumentation-express';
import { Injectable } from '@nestjs/common';
import { ZIPKIN_TRACER_METADATA_KEY } from '../constants/constants';

@Injectable()
export class ZipkinService {
  private readonly options: ZipkinOptions | null;
  private context: any;
  private recorder: any;
  private tracer: any;

  constructor(options?: ZipkinOptions) {
    if (options) {
      this.options = options;
      this.init();
    } else {
      this.options = null;
    }
  }

  private init() {
    this.context = new ExplicitContext();
    this.recorder = new BatchRecorder({
      logger: new HttpLogger({
        endpoint: this.options!.url,
        jsonEncoder: jsonEncoder.JSON_V2,
      }),
    });
    this.tracer = new Tracer({ ctxImpl: this.context, recorder: this.recorder, localServiceName: this.options!.serviceName });
    Reflect.defineMetadata(ZIPKIN_TRACER_METADATA_KEY, this.tracer, ZipkinService);
  }

  public getTracer() {
    return this.tracer;
  }

  public getMiddleware() {
    return expressMiddleware({ tracer: this.tracer });
  }
}
