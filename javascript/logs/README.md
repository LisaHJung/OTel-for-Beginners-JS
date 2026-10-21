# OpenTelemetry for Beginners - The JavaScript Journey (Logs)

Getting started with OpenTelemetry can feel overwhelming, but this beginner series for JavaScript developers will guide you step by step. This guide covers the **logs** signal and builds directly on the traces and metrics guides.

> **New to the series?** Start with the [Traces walkthrough](../traces/README.md), which covers Episode 1 (_What is OpenTelemetry?_), the pipeline overview, and setting up your learning environment, then the [Metrics walkthrough](../metrics/README.md). This logs guide picks up from there and assumes you've met the same prerequisites and are comfortable running the Roll the Dice app.

## Prerequisites

Same as the earlier guides. Before getting started, make sure you have installed:
- [Node.js](https://nodejs.org/en/download/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Resources
- [OpenTelemetry documentation](https://opentelemetry.io/docs/)
  - Ask AI (⌘+K shortcut)
  - [Language APIs and SDKs](https://opentelemetry.io/docs/languages/)
  - [Logs](https://opentelemetry.io/docs/concepts/signals/logs/)
  - [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)
    - [List of OpenTelemetry Collector processors](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor)
  - [Transform processor (OTTL)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/transformprocessor)
- [OpenSearch documentation](https://docs.opensearch.org/)
- [OpenTelemetry YouTube channel](https://www.youtube.com/@otel-official)
  - [OpenTelemetry for Beginners series - The JavaScript Journey](https://youtu.be/iEEIabOha8U?feature=shared)
- [OpenTelemetry Slack channel](https://opentelemetry.io/community/end-user/slack-channel/)

# Episode 8 - Logs Instrumentation and Bare-Bones OTel Collector Configuration

In the trace and metric episodes, we instrumented our app, sent telemetry through the OpenTelemetry Collector, and visualized it in a backend.

<!-- TODO screenshot -->

Those two signals, traces and metrics, are only part of the picture. The third is **logs**.

If you've ever debugged an app by reading through its output, you've already worked with logs. 

They give us a record of individual events, helping us understand what happened and when. That focus on individual events is what sets logs apart from the other signals. 

A metric tells us _how many_ requests came in or _how long_ they took, and a trace tells us the path of a single request, but a log captures _what happened_ at a specific moment.

Just like we did with traces and metrics, we're going to start simple. 

We'll configure a bare-bones OTel Collector to receive logs and export them to OpenSearch. We'll use this setup to explore our logs as they are, before we start processing them. 

<!-- TODO screenshot -->

Then, in the next episode, we'll add processors and see how we can transform our logs before they're exported. Let's get everything set up.

## Run the learning environment locally

If you've been following along from the metrics episode, you should already have two terminals open. 

One running the Roll the Dice app and another running Docker. We'll reuse both. 

In each terminal, stop what's running, move into the `logs/bare-bones-setup` folder, and start it back up. Make sure Docker Desktop is open and running before you bring the stack up.

**Terminal 1 - Roll the Dice app**
```bash
# stop the running app
Ctrl + C
# move to the logs bare-bones folder
cd ../../logs/bare-bones-setup
# install this folder's dependencies, then start the app
npm install
npm start
```

**Terminal 2 - Docker (Collector + Jaeger + Prometheus + OpenSearch)**
```bash
# stop and remove the metrics stack
docker compose down
# move to the logs bare-bones folder
cd ../../logs/bare-bones-setup
# bring the stack up (bare-bones logs setup, adds OpenSearch)
docker compose up
```

This bare-bones setup runs the Collector, Jaeger, Prometheus, OpenSearch, and OpenSearch Dashboards side by side with our app. For logs, OpenSearch is our backend for storing and searching, and OpenSearch Dashboards is where we'll explore them.

Once everything is running, we're ready to generate some logs.

**Verify the app is running**

In your browser, go to the following URL: http://localhost:8080/rolldice

Refresh the page multiple times. This app will generate a random number from 1–6, just as if you were rolling a die. Every roll also emits a log record.

<!-- TODO screenshot/gif of the Roll the Dice app in the browser -->

**See the logs flow through the Collector**

Take a look at the terminal that is running Docker. You'll see logs flowing through the Collector.

One thing to keep in mind. Unlike traces, our logs are **batched** before they're sent, so they won't appear the instant you roll. Give it a few seconds, then look for them.

Because each log is small compared to the metrics output, it's easy to scroll past. To make them easy to spot, you can run this command to filter the Collector's output down to just the log records.

```
docker compose logs otel-collector -f | grep --line-buffered -A8 "LogRecord #"
```

<!-- TODO screenshot of the Collector debug output showing a LogRecord flowing through -->

Since we know our app is generating logs and the Collector is receiving them, let's head into the code and see how those logs are being generated.

> **Quick heads-up.** To keep things easy to follow, the code snippets below only show the logs-related bits. Your actual files have more going on, the traces and metrics setup from the earlier episodes (in `instrumentation.js` and the Collector config) and the rest of the app's own code (in `app.js`), we've just trimmed it out here so it's easier to focus on logs.

## The packages (package.json)

For our logs example, we've added three OpenTelemetry packages on top of what the earlier episodes used:

<!-- TODO screenshot of package.json highlighting the logs dependencies -->

- `@opentelemetry/api-logs` is the **Logs API**. It lets our app create log records in our code.
- `@opentelemetry/sdk-logs` is the **Logs SDK**. It collects those records and prepares them for export.
- `@opentelemetry/exporter-logs-otlp-grpc` is the **OTLP log exporter**, which sends our log records to the Collector over gRPC.

Together, these let our app create logs and send them to the Collector.

Now that we’ve covered the packages, let’s see how we use them in our app. 

## instrumentation.js

This file prepares our app to generate logs and send them to the local Collector. It should look familiar from the traces and metrics setup, with the logs pieces added:

```
const opentelemetry = require('@opentelemetry/sdk-node');

const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');

const {
  OTLPLogExporter,
} = require('@opentelemetry/exporter-logs-otlp-grpc');

const {
  BatchLogRecordProcessor,
} = require('@opentelemetry/sdk-logs');

const sdk = new opentelemetry.NodeSDK({
  // ...trace and metric configuration from the earlier episodes...
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
```

At a high level, `instrumentation.js` does the same four things it did for metrics, with one addition for logs:

1. Import the OpenTelemetry SDK and the auto-instrumentation module, along with the OTLP log exporter and the batch log record processor.
2. Create a new `NodeSDK` instance.
3. For logs, add that **batch log record processor**, wrapping the OTLP log exporter. It groups our log records together before sending them to the Collector listening on port `4317`, the standard OTLP endpoint. That's why our logs show up in the debug output in small batches, a few seconds after we roll.
4. Start the SDK.

## app.js

Up to now, OpenTelemetry has auto-generated traces and metrics, without us changing a line of application code. That's **automatic instrumentation**. 

Logs are the exception. Because our app has no logging library for OpenTelemetry to hook into automatically, we create the log record ourselves with the Logs API. This is **manual instrumentation**:

```
const { logs, SeverityNumber } = require('@opentelemetry/api-logs');

const logger = logs.getLogger('rolldice-app');

app.get('/rolldice', (req, res) => {
  const roll = getRandomNumber(1, 6);

  logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body: `Rolled a dice and got ${roll}`,
    attributes: { 'dice.value': roll },
  });

  res.send(roll.toString());
});
```

Every time we roll the dice, we call the logger and create a log record. That record carries:
- a **severity** of `INFO`, which marks this as a routine event,
- a **body**, the message `Rolled a dice and got <value>`, and
- a `dice.value` **attribute**, which pulls out the specific number we rolled.

Notice that every roll is emitted at that same `INFO` severity, whether we roll a one or a six. We'll put that severity to work in the next episode.

This is our first taste of **manual instrumentation**. We write the code ourselves to record an event that matters to us, one auto-instrumentation couldn't capture on its own. 

Now that we've seen how our app generates logs, let's look at how the Collector receives and exports them.

## OpenTelemetry Collector Configuration

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

  prometheus:
    endpoint: 0.0.0.0:8889

  opensearch:
    http:
      endpoint: http://opensearch:9200
    logs_index: otel-logs

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [debug, otlp/jaeger]
    metrics:
      receivers: [otlp]
      exporters: [debug, prometheus]
    logs:
      receivers: [otlp]
      exporters: [debug, opensearch]
```

Just like before, our configuration has three main parts. Receivers, exporters, and service pipelines. 

Our receiver hasn't changed, so let's start with the exporter, then we'll take a look at the logs pipeline.

**Exporters define where the Collector sends telemetry.** 

For logs, we use two:
```
exporters:
  debug:
    verbosity: detailed

  opensearch:
    http:
      endpoint: http://opensearch:9200
    logs_index: otel-logs
```
- The **`debug` exporter** prints our logs to the Collector's logs so we can verify they're flowing through. 
- The **`opensearch` exporter** is where things change. 

For traces we exported to Jaeger, and for metrics to Prometheus. 

This time we send our logs to **OpenSearch**, our backend for storing and searching logs. It writes them to an index called `otel-logs`. We'll explain what an index is shortly.

**The `service` component defines how data moves through the Collector.**
```
service:
  pipelines:
    logs:
      receivers: [otlp]
      exporters: [debug, opensearch]
```
- The **`otlp` receiver** accepts logs from our app.
- The **`debug` exporter** prints them to the terminal.
- The **`opensearch` exporter** sends them to OpenSearch for storage.

Together, these components define the path our logs take through the Collector.

Now that everything is configured, let’s see it in action.

## Exploring logs in OpenSearch Dashboards

Open your browser and go to `http://localhost:5601` to reach OpenSearch Dashboards, where we'll explore our logs. Before any of them show up, there's one thing we need to set up.

**What's an index?**

Back in the Collector config, the `opensearch` exporter sets `logs_index` to `otel-logs`.

```yaml
exporters:
  opensearch:
    http:
      endpoint: http://opensearch:9200
    logs_index: otel-logs
```

That tells OpenSearch to group our records together under that name, and that grouping is what OpenSearch calls an **index**. 

Think of it like a folder for related data that keeps everything organized and easy to find.

**What's an index pattern?**

Our data is already in OpenSearch, but Dashboards still needs to know which index we want to explore. That's what an **index pattern** is for, a saved pointer that tells Dashboards where to look. We'll create one that points to `otel-logs`.

**Create the index pattern**
1. From the OpenSearch Dashboards home page, click **Manage** in the top-right corner.
2. In the menu on the left, select **Index patterns**, then click **Create index pattern**.
3. For the index pattern name, enter `otel-logs`. You'll see it match the `otel-logs` index below. Click **Next step**.
4. Open the time field dropdown and select `@timestamp`, then click **Create index pattern**.

<!-- TODO screenshot of the Create index pattern screen with otel-logs and @timestamp -->

> **A note on timestamps.** 

Each log carries two. `@timestamp` is when the event happened in our app, and `observedTimestamp` is when the SDK collected it (a few seconds later, because of batching). 

We use `@timestamp` so our logs line up on the timeline by when we actually rolled the dice.

**View your logs**
1. Open the menu in the top-left corner and select **Discover**.
2. Make sure `otel-logs` is selected in the dropdown near the top-left.
3. Remember, our app only creates logs when we roll, so head back to the Roll the Dice app and roll a few times. Then return to **Discover**, set the time range (top-right) to **Last 15 minutes**, and click **Refresh**. 

If you see "No results," give the batch a few seconds and check that your time range covers the last few minutes.

<!-- TODO screenshot of Discover showing a list of otel-logs records -->

Once your records appear, **expand one** by clicking the arrow at the start of its row and read through it top to bottom. This is where the body and `dice.value` attribute we added back in `app.js` finally show up, now that the log has made its way through the Collector and into OpenSearch.

- **`body`** holds the message we wrote in our code, `Rolled a dice and got <value>`. It tells us what happened.
- **`attributes.dice.value`** (just above the body) pulls out a specific detail, the number we rolled.
- The **`resource.*`** fields are **resource attributes**. Instead of describing the event, they tell us where the telemetry came from, our application, process, and host. Because they describe the source and not the event, they stay the same on every log, unlike `dice.value`, which changes with each roll. Just like we saw with traces and metrics, many were added automatically, and some are more than we need, like host identifiers, the process owner, and the command used to start our app. We'll clean these up in the next episode.
- The **severity** fields tell us how important an event is. We set every roll to `INFO` because they're routine, so here we see a `severity.text` of `INFO` and a `severity.number` of `9`. That `9` has nothing to do with the number we rolled, in OpenTelemetry, `9` is the `INFO` level. In the next episode we'll give our rolls different severity levels and use them to filter our logs.
- At the bottom is the **trace context**, a `traceId` and `spanId` we never added ourselves. OpenTelemetry attached them automatically because this log was created while a traced request was running. The `traceId` links this log to that request's trace, so we can jump straight from a log to the full request it belongs to.

<!-- TODO screenshot of an expanded otel-logs record highlighting body, attributes.dice.value, resource.*, severity, and trace context -->

**Scan many logs at once.** Expanding one record is great for a single event, but to compare several at a glance we can turn fields into columns. Under **Available fields** on the left, find `attributes.dice.value` and `severity.text` and click **Add** for each. Now every row shows the roll next to its severity. Keep this view in mind, it's exactly how we'll compare our logs before and after processing in the next episode.

<!-- TODO screenshot of Discover with attributes.dice.value and severity.text added as columns -->

Now that logs are being generated and exported through the Collector, we can start processing them before they're stored.
