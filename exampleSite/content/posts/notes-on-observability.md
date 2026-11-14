---
title: "Notes on observability"
date: 2025-12-11
description: "Logs, metrics and traces, and what each one is good at."
tags: ['observability', 'reliability']
comments: true
---

The three signals answer different questions, and using the wrong one for the job is the usual source of frustration.

## Metrics

Cheap, aggregated numbers. Good for dashboards and alerts: *is something wrong?*

## Logs

Detailed, per-event records. Good for answering *what exactly happened?* once you know where to look.

## Traces

Request-scoped timing across services. Good for *where is the time going?*

> Alert on metrics, investigate with traces, confirm with logs.
