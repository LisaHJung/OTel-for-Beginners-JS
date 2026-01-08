# OpenTelemetry for Beginners - The JavaScript Journey

Getting started with OpenTelemetry can feel overwhelming, but this beginner series for JavaScript developers will guide you step by step.

First, we’ll answer the question: What is OpenTelemetry?

# Episode 1 - What is OpenTelemetry?
🎬 Watch this video to learn what OpenTelemetry is and why it matters.

[![Watch the video](https://img.youtube.com/vi/iEEIabOha8U/0.jpg)]([https://www.youtube.com/watch?v=fZRwVwCvLAg](https://youtu.be/iEEIabOha8U))

Now that you’ve covered the basics in Episode 1, let’s move on to Episode 2 to explore the architecture and objectives that will kickstart your trace pipeline.

# Episode 2 - Overview: Kickstart Your Trace Pipeline with OpenTelemetry
## Learning Environment Architecture
<img width="1906" alt="image" src="https://github.com/user-attachments/assets/71773bfa-e488-4e8f-92fd-d36468827a75" />

## Objectives 
- Instrument a Node.js app using the Auto Instrumentation Module to generate traces and send them to the OpenTelemetry Collector.
- Configure the OpenTelemetry Collector to receive, process, and export traces to the Jaeger backend.
- Use the Jaeger UI to visualize and verify that the traces have been correctly processed.

**Note:**
- Docker runs the OTel Collector and Jaeger side by side with our app for easy setup and integration. 

<img width="1918" alt="image" src="https://github.com/user-attachments/assets/a398be28-3bbc-4895-b343-8cbc09fac606" />

## Resources
- [OpenTelemetry documentation](https://opentelemetry.io/docs/)
  - Ask AI (⌘+K shortcut)
  - [Language APIs and SDKs](https://opentelemetry.io/docs/languages/)
  - [Instrumentation](https://opentelemetry.io/docs/concepts/instrumentation/)
  - [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)
    - [List of OpenTelemetry Collector processors](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor) 
- [OpenTelemetry YouTube channel](https://www.youtube.com/@otel-official)
  - [OpenTelemetry for Beginners series - The JavaScript Journey](https://youtu.be/iEEIabOha8U?feature=shared)
- [OpenTelemetry Slack channel](https://opentelemetry.io/community/end-user/slack-channel/)

## Two project branches 
1. [`traces-barebones-setup`](https://github.com/LisaHJung/O4B/tree/original-setup)
- Instruments the Roll the Dice app and sends traces to the OpenTelemetry Collector.
- The Collector forwards traces to Jaeger for storage and visualization.
2. [`traces-add-processors`](https://github.com/LisaHJung/O4B/tree/post-processing) 
- Uses the same setup as traces-barebones-setup, but applies processors to traces. 
- These processors enrich and clean up resource and attribute data, and batch traces for more efficient exporting.

#  Episode 3 - Set Up Your Learning Environment: Ready, Steady, Trace!

## Run the Demo Locally
**Before getting started, make sure you have installed:
- [Node.js](https://nodejs.org/en/download/) 
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)
  
**Clone the project**
```
# Choose a directory of your choice
git clone https://github.com/LisaHJung/REPLACE-THIS-WITH-CORRECT-REPO.git
```
**Start the server**

Execute the following commands:
```
# In the project directory
npm install
npm start
```
**Verify the app is running**

In your browser, go to the following URL: http://localhost:8080/rolldice

Refresh the page multiple times. This app will generate a random number from 1–6, just as if you were rolling a die.

![Roll the dice mov](https://github.com/user-attachments/assets/32f80dc2-93b0-4578-91db-17b316a79760)

**Using Docker, run the OTel Collector and Jaeger**

Before getting started, make sure Docker Desktop is open and running.

<img width="2548" height="1440" alt="image" src="https://github.com/user-attachments/assets/34b5d38f-01b9-4294-a61e-33c6f40e3dda" />

```
# In a different terminal, within the project directory
docker compose up --build 
```
**Refresh the Roll the Dice app page multiple times to send traces to the OTel Collector**

Take a look at the terminal that is running Docker.

You will be able to see the logs of traces that are flowing through the Collector.

<img width="997" height="990" alt="image" src="https://github.com/user-attachments/assets/183a32a9-2752-4f56-a770-b76292019859" />

**Verify that the OTel Collector is sending traces to the Jaeger backend**
1. Go to the following URL (http://localhost:16686/) to access the Jaeger UI. 

2. Click on the "Service" section (orange box) to view all the services that are sending traces to Jaeger.

<img width="2560" height="1296" alt="image" src="https://github.com/user-attachments/assets/2fb3c82f-d65b-4400-a8a9-2a71a51658b0" />

In our set up, the service name was set to "OTel4Beginners". 

Select the service "OTel4Beginners" then click on the "Find Traces" button (blue arrow).

If you don't see the service name "OTel4Beginners", refresh the Roll the Dice app page a few times. Verify that the OpenTelemetry Collector is receiving telemetry by checking its logs (terminal running Docker), then refresh the Jaeger UI page again.

3. Click on one of the traces (orange box)
<img width="2544" height="1266" alt="image" src="https://github.com/user-attachments/assets/a3a509e5-0851-48e7-ba0e-087e8ceafbbe" />

4. Click on its root span (Get/rolldice span)
<img width="2559" height="511" alt="image" src="https://github.com/user-attachments/assets/459a28ed-c7f1-4d0b-b6e1-0529cf709d75" />

5. Expand the `Tags` and `Process` sections to view the metadata about traces collected from the app
<img width="2558" height="660" alt="image" src="https://github.com/user-attachments/assets/1138c2b9-dd0e-41ea-9aa5-c62ccb7150c7" />

**The `Tags` section shows details about what happened during a request.** 

<img width="2560" height="1321" alt="image" src="https://github.com/user-attachments/assets/acdd9538-b114-4987-8446-acb11312dddf" />

It consists of `span attributes` (e.g., routes, method, errors) to help you understand app behavior.

**The `Process` section shows information about the app or service that created the trace.**

<img width="2553" height="1305" alt="image" src="https://github.com/user-attachments/assets/65577f59-8850-4344-ad63-2a71fef2e818" />

It consists of `resource attributes` that describe the machine it ran on and the command used to start it. 
It helps you see where the request came from and which service handled it.

With your environment set up and a chance to visualize traces generated by your app in Jaeger, you might be wondering: how does your application actually create these traces? That’s where `instrumentation` comes in.

# Episode 4 - Back to Basics: Trace Instrumentation and Bare-Bones OTel Collector Configuration

To observe your application or infrastructure, we first need to instrument it. In other words, we’re enabling it to generate traces, metrics, and logs.

Using OpenTelemetry, we can instrument your code in two primary ways:
- Automatic instrumentation (AKA zero-code solutions)
- Manual instrumentation (AKA code-based solutions)

`Automatic instrumentation` is ideal for getting started or when we can’t modify the application itself. They automatically capture rich telemetry from the libraries your app uses and the environment it runs in, essentially giving you visibility at the edges of your system.

`Manual instrumentation` gives you deeper insight by generating rich telemetry directly from your application. Using the OpenTelemetry API, you can create custom traces, metrics, and logs that complement the data collected automatically.

In this episode, we will focus on automatic instrumentation so we can generate traces and visualize them in Jaeger. 

In our setup, the following OTel packages have been installed:  
<img width="2087" height="1145" alt="image" src="https://github.com/user-attachments/assets/b3848c07-d99d-4f92-9817-551fc66bf1ef" />

`@opentelemetry/sdk-node` is the core OpenTelemetry SDK for Node.js. It gives our app the tools it needs to generate, manage, and collect telemetry such as traces and metrics.

With `@opentelemetry/auto-instrumentations-node`, popular Node.js libraries and frameworks are instrumented automatically, allowing our app to generate telemetry with zero code changes.

`@opentelemetry/exporter-trace-otlp-grpc` sends the telemetry our app generates to any OTLP-compatible collector or backend over gRPC, moving trace data out of our app so it can be processed, stored, and visualized.

**instrumentation.js**

This file prepares your app to generate traces through auto-instrumentation and send this trace data to a collector or backend.

```
const opentelemetry = require('@opentelemetry/sdk-node');

const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');

const {
  OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-grpc');

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
     url: 'http://localhost:4317', 
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

`instrumentation.js` performs four main tasks:

1. Import the OTel packages required for tracing:
```
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
```

2. Initialize the tracing system by creating a new NodeSDK instance:

```
const sdk = new opentelemetry.NodeSDK({
  // configuration goes here
});
```

3. Configure the system to automatically generate traces and send them to the local OpenTelemetry Collector:

```
const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4317',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

```
4. Start the tracing system to begin recording and sending traces to the Collector:
```
sdk.start();
```
**IMPORTANT**

- The instrumentation setup and configuration must run **before** your application code. 
  - A common way to do this is by using the –require flag.
- In a properly instrumented application, the service name is set as an environment variable.
- To ensure this, we added the following `start` script to `package.json` (see below):
  
**package.json**

```
{
  "name": "latest",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    **"start": "OTEL_SERVICE_NAME=demo node --require ./instrumentation.js app.js"**
  },
  "keywords": [],
  "author": "",   
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@opentelemetry/auto-instrumentations-node": "^0.60.1",
    "@opentelemetry/exporter-trace-otlp-grpc": "^0.202.0",
    "@opentelemetry/sdk-node": "^0.202.0",
    "express": "^5.1.0"
  }
}
```
## OTel Collector Configuration
**otel/otel-collector-config.yaml**
```
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  debug:
    verbosity: detailed

  otlp/jaeger:
    endpoint: jaeger:4317
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [debug, otlp/jaeger]
```
**Our OpenTelemetry Collector configuration is made up of three components:**
1. Receivers
2. Exporters
3. Service 

**Receivers tell the Collector how to accept incoming telemetry data**
```
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

```
- The OTLP receiver is configured to accept telemetry over both gRPC (4317) and HTTP (4318).
- This allows our app to send trace data to the Collector using standard OTLP endpoints.
  
**Exporters send data from the Collector to the OTLP-compliant backend(s) of your choice.**
```
exporters:
  debug:
    verbosity: detailed

  otlp/jaeger:
    endpoint: jaeger:4317
    tls:
      insecure: true
```
- The `debug` exporter prints the telemetry data to the Collector’s logs in a detailed way.
  - It displays what data is flowing through the Collector and is useful for debugging or development. 
  
<img width="997" height="990" alt="image" src="https://github.com/user-attachments/assets/183a32a9-2752-4f56-a770-b76292019859" />
 
- The **`otlp/jaeger` exporter** forwards telemetry to a Jaeger backend running at port **4317**.

**The `service` component defines how data moves through the Collector.**
```
service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [debug, otlp/jaeger]
```
- Our configuration defines a pipeline for traces.
- The traces sent from the app is received by the **`otlp` receiver**.
- The **`debug` exporter** logs traces to the terminal where the Collector is running.
- The **`otlp/jaeger` exporter** forwards traces to Jaeger. 

<img width="2544" height="1266" alt="image" src="https://github.com/user-attachments/assets/a3a509e5-0851-48e7-ba0e-087e8ceafbbe" />

# Episode 5 - Processing Traces: OpenTelemetry Collector in Action

**Switch to the [`traces-add-processors`](https://github.com/LisaHJung/O4B/tree/post-processing) branch using your terminal:**
```
//in the project directory
git checkout traces-add-processors
``` 
**Stop and restart the OpenTelemetry Collector and Jaeger.**
```
//in the project directory
CTRL + C
docker compose up --build 
```
**Refresh the Roll the Dice app page multiple times to send traces to the newly configured OpenTelemetry Collector.**

<img width="890" height="997" alt="image" src="https://github.com/user-attachments/assets/a8c0a4d1-9244-40da-8b8c-1f508547e9cb" />

**Using the Jaeger UI, examine the new traces to verify they were processed correctly.**
<img width="2560" height="1234" alt="image" src="https://github.com/user-attachments/assets/2b6a0d10-bbac-4925-ad2a-b8bf8b8f30a7" />
<img width="2560" height="1013" alt="image" src="https://github.com/user-attachments/assets/c60774ba-fb26-43c6-82b4-631821f13753" />

**Add three processors to the existing OpenTelemetry Collector configuration.**
- `resource` 
- `attributes` 
- `batch` 

**otel/otel-collector-config.yaml**
```
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  resource:
    attributes:
      - key: deployment.environment.name
        value: local
        action: insert
      - key: host.arch
        action: delete
      - key: host.id
        action: delete
      - key: host.name
        action: delete  
      - key: process.command
        action: delete
      - key: process.command_args
        action: delete
      - key: process.executable.path
        action: delete
      - key: process.owner
        action: delete
      - key: process.pid
        action: delete

  attributes:
    actions:
      - key: http.user_agent
        action: delete
      - key: net.host.ip
        action: delete
      - key: net.peer.ip
        action: delete
      - key: net.host.port
        action: delete
      - key: net.peer.port
        action: delete

  batch:
    timeout: 5s
    send_batch_size: 512

exporters:
  debug:
    verbosity: detailed

  otlp/jaeger:
    endpoint: jaeger:4317
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [resource, attributes, batch]
      exporters: [debug, otlp/jaeger]
```
**Processors modify, filter, or enrich telemetry data within the Collector before it is exported.**

**The `resource` processor modifies metadata about the service or host.**
```
processors:
  resource:
    attributes:
      - key: deployment.environment.name
        value: local
        action: insert
      - key: host.arch
        action: delete
      - key: host.id
        action: delete
      - key: host.name
        action: delete  
      - key: process.command
        action: delete
      - key: process.command_args
        action: delete
      - key: process.executable.path
        action: delete
      - key: process.owner
        action: delete
      - key: process.pid
        action: delete
```
- The `deployment.environment.name` resource attribute is added to incoming traces.

<img width="2560" height="994" alt="image" src="https://github.com/user-attachments/assets/a057f3c0-8af6-4eb6-a435-c6f2c30290ca" />

```
processors:
  resource:
    attributes:
      - key: deployment.environment.name
        value: local
        action: insert
      - key: host.arch
        action: delete
      - key: host.id
        action: delete
      - key: host.name
        action: delete  
      - key: process.command
        action: delete
      - key: process.command_args
        action: delete
      - key: process.executable.path
        action: delete
      - key: process.owner
        action: delete
      - key: process.pid
        action: delete
```
The following resource attributes were deleted to remove sensitive or irrelevant data.  
This helps reduce noise, improve privacy, and keep trace data focused.

  - host.arch
  - host.id
  - host.name
  - process.command
  - process.command_args
  - process.executable.path
  - process.owner
  - process.pid

**Old traces from the original OTel Collector configuration:**
<img width="2558" height="1295" alt="image" src="https://github.com/user-attachments/assets/5c66290e-46c0-4d91-8a4b-aeb347d042f8" />

**New traces from the new OTel Collector configuration:**
<img width="2560" height="995" alt="image" src="https://github.com/user-attachments/assets/7225ae17-fba8-4850-8ca2-f98a7e4fe240" />

**The `attributes` processor modifies, adds, or removes span attributes.**

```
attributes:
    actions:
      - key: http.user_agent
        action: delete
      - key: net.host.ip
        action: delete
      - key: net.host.port
        action: delete
      - key: net.peer.ip
        action: delete
      - key: net.peer.port
        action: delete
```

The following span attributes were deleted to remove sensitive or personally identifiable information (PII):
  - http.user_agent
  - net.peer.ip
  - net.host.port
  - net.peer.port

Deleting these attributes enhances privacy, improves security compliance, and reduces the size of trace payloads.

**Old traces from the original OTel Collector configuration:**
<img width="2557" height="1324" alt="image" src="https://github.com/user-attachments/assets/94fad5ad-7760-4392-93a2-ade8ee1335f4" />

**New traces from the new OTel Collector configuration:**
<img width="2559" height="1230" alt="image" src="https://github.com/user-attachments/assets/f82d4cad-d184-4b0e-ab19-75400b44ac4f" />

**The `batch` processor groups telemetry data into batches before exporting.**
```
batch:
    timeout: 5s
    send_batch_size: 512

```
As a best practice, add the `batch` processor to the Collector configuration to improve performance and reduce overhead.

Adjust these parameters to fit your specific use case.

**The service component was updated to include the newly added processors.**
```
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [resource, attributes, batch]
      exporters: [debug, otlp/jaeger]
```

**IMPORTANT**

In the `service` component, you must pay attention to the order in which processors are listed, as they are applied sequentially.

The `batch` processor should be listed **last** to group the data into batches before exporting. 


## Resources
- [OTel documentation](https://opentelemetry.io/docs/)
  - Ask AI (⌘+K)
  - [Language APIs and SDKs](https://opentelemetry.io/docs/languages/)
  - [Instrumentation](https://opentelemetry.io/docs/concepts/instrumentation/)
  - [OTel Collector](https://opentelemetry.io/docs/collector/)
    - [List of OTel Collector processors](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor) 
- [OTel YouTube channel](https://www.youtube.com/@otel-official)
  - [OTel for Beginners series - The JavaScript Journey](https://youtu.be/iEEIabOha8U?feature=shared)
    - Stay tuned for videos on this talk + working with other telemetry types.
- [OTel Slack channel](https://opentelemetry.io/community/end-user/slack-channel/)

