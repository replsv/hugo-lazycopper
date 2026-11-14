---
title: "Retries with exponential backoff and jitter"
date: 2026-06-19
description: "Why naive retries make outages worse, and a small helper that gets it right."
tags: ['distributed-systems', 'reliability']
---

When a dependency is struggling, every client retrying immediately turns a blip into an outage. Backoff spreads the load out; jitter stops clients from retrying in lockstep.

## The helper

```python
import random, time

def retry(fn, attempts=5, base=0.1, cap=5.0):
    for attempt in range(attempts):
        try:
            return fn()
        except TransientError:
            if attempt == attempts - 1:
                raise
            time.sleep(random.uniform(0, min(cap, base * 2 ** attempt)))
```

## Rules of thumb

- Only retry errors that can succeed on a second try.
- Cap both the delay and the number of attempts.
- Make the operation idempotent before you retry it.
