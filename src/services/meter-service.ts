import * as pClient from 'prom-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeterService {
  private summary: any;
  private readonly namespace: string;
  private readonly appName: string;

  constructor(namespace: string, appName: string) {
    this.summary = null;
    this.namespace = namespace;
    this.appName = appName;
  }

  createSummary(labelNames: string[], description: string) {
    if (!this.summary) {
      this.summary = new pClient.Summary({
        labelNames,
        name: this.namespace,
        help: description,
      });
    }
    return this.summary;
  }

  getAppName() {
    return this.appName;
  }

  async getMetrics() {
    return await pClient.register.metrics();
  }
}
