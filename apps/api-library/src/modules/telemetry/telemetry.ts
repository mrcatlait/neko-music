import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { Resource } from '@opentelemetry/resources'
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { ATTR_SERVICE_INSTANCE_ID, ATTR_SERVICE_NAMESPACE } from '@opentelemetry/semantic-conventions/incubating'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'

process.env.OTEL_EXPORTER_OTLP_METRICS_DEFAULT_HISTOGRAM_AGGREGATION = 'explicit_bucket_histogram'
process.env.OTEL_SEMCONV_STABILITY_OPT_IN = 'http'

const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
})

const metricExporter = new OTLPMetricExporter({
  url: 'http://localhost:4318/v1/metrics',
})

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO)

const sdk = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: `nestjs-otel`,
    [ATTR_SERVICE_INSTANCE_ID]: 'local',
    [ATTR_SERVICE_NAMESPACE]: 'library',
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 1000,
  }),
  spanProcessors: [new SimpleSpanProcessor(traceExporter)],
  instrumentations: [getNodeAutoInstrumentations()],
})

sdk.start()

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0))
})

// https://medium.com/@hassan-murtaza/better-observability-in-nestjs-using-opentelemetry-and-jeager-c70213ea06c1
// https://www.tomray.dev/nestjs-open-telemetry
// https://medium.com/@codewithalfredo/monitoring-in-production-a-guide-to-using-opentelemetry-with-nestjs-and-signoz-aeee59a8be0a
