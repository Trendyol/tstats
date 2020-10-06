# Tstats

> A library for collecting app metrics from nest.js application.

<br/>

TSTATS contains decorator(s) and interceptor(s) for tracing and collecting performance metrics from nest.js application.    
This library was created as a nest.js module and heavily depended on Prometheus and Zipkin.

## Features
- Injects global interceptor and collect performance metrics on requests and publishes for Prometheus.
- Injects global middleware and Traces every request with Zipkin (zipkin-express).
- Provides decorator for Zipkin segmentation.

<br/>

## Getting started
Just install the library `tstats`:

```sh
$ npm i tstats -S
```

```sh
$ yarn add tstats
```
<br/>

## Usage

APPLY MODULE
```typescript
import { TstatsModule } from 'tstats/dist/tstats-module';

@Module({
  imports: [
    TstatsModule.register({
          namespace: 'NAMESPACE_FOR_PROMETHEUS',
          appName: 'APPLICATION_NAME_FOR_PROMETHEUS_AND_IN_GENERAL',
          zipkin: {
            serviceName: 'ZIPKIN_SERVICE_NAME',
            url: 'http://[ZIPKIN_URL]/api/v2/spans'
          },
          enabled: true
        })
  ],
  providers: []
})

export class ApplicationModule {}
```
<br/>

ZIPKIN SEGMENTATION
<br/>
This decorator not compulsory to use but most of the time You will need it.
<br/>
```typescript

class SomeClassToTrace {
    
    @ZipkinSegment()
    public async someAsyncMethodToTrace() {
        return await someAsyncJob();
    }
    
    @ZipkinSegment('Optional name')
    public someMethodToTrace() {
        return someJob();
    }

}
```
<br/>

## Configuration

### Module Options
|  Param     |  Type           | Optional | Description                                        |
|------------|-----------------|----------|----------------------------------------------------|
| namespace  | string          |    NO    |    Prometheus summary namespace                    |
| appName    | string          |    NO    |    Prometheus service name                         |
| zipkin     | ZipkinOptions   |    NO    |    Zipkin Options                                  |
| enabled    | boolean         |    YES   |    Is module active  (ex: enabled = env == 'prod') |


### ZipkinOptions
|  Param      |  Type           | Optional | Description                                    |
|-------------|-----------------|----------|------------------------------------------------|
| serviceName | string          |    NO    |    Zipkin service name app identifier          |
| url         | string          |    NO    |    Zipkin url                                  |
