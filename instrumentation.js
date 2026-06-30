const opentelemetry = require('@opentelemetry/sdk-node');

const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');

const {
  OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-grpc');

const {
  OTLPMetricExporter,
} = require('@opentelemetry/exporter-metrics-otlp-grpc');

const {
  PeriodicExportingMetricReader,
} = require('@opentelemetry/sdk-metrics');

const {
  OTLPLogExporter,
} = require('@opentelemetry/exporter-logs-otlp-grpc');

const {
  BatchLogRecordProcessor,
} = require('@opentelemetry/sdk-logs');

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4317',
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: 'http://localhost:4317',
    }),
    exportIntervalMillis: 10000,
  }),
  logRecordProcessors: [
    new BatchLogRecordProcessor(
      new OTLPLogExporter({
        url: 'http://localhost:4317',
      }),
    ),
  ],
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
