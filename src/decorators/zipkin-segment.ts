import { ZipkinService } from '../services/zipkin-service';
import { ZIPKIN_TRACER_METADATA_KEY } from '../constants/constants';

export function ZipkinSegment(name?: string) {
  return (target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
    const method = propertyDescriptor.value;
    propertyDescriptor.value = function (...args: any[]) {
      const tracer = Reflect.getMetadata(ZIPKIN_TRACER_METADATA_KEY, ZipkinService);
      return tracer
        ? tracer.local(name ? name : `${target.constructor.name}-${propertyKey}`, () => method.apply(this, args))
        : method.apply(this, args);
    };
  };
}
