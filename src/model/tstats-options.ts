import { ZipkinOptions } from './zipkin-options';

export interface TstatsOptions {
  enabled?: boolean;
  namespace: string;
  appName: string;
  zipkin: ZipkinOptions;
}
