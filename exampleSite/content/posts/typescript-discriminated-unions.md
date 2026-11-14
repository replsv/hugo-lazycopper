---
title: "Modelling state with discriminated unions"
date: 2026-04-07
description: "Making impossible states unrepresentable in TypeScript."
tags: ['typescript']
---

A common bug: a `loading` flag, an `error` field and a `data` field that can all be set at once. A discriminated union makes that combination impossible to write.

```ts
type State<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; data: T };
```

## Narrowing

Checking `status` narrows the type, so `data` is only accessible in the success branch:

```ts
function render(state: State<User>) {
  switch (state.status) {
    case "success":
      return state.data.name;
    case "error":
      return state.error.message;
    default:
      return "…";
  }
}
```
