---
title: "Getting started with Go generics"
date: 2026-10-28
description: "A practical tour of type parameters, constraints and when generics actually help."
tags: ['go', 'generics']
---

Every codebase reaches a point where the same helper gets written three times with three different types. This post walks through a small, real example and shows where the language features pay off, and where they just add noise.

## The problem

Suppose we need a function that returns the keys of a map in sorted order. Without type parameters you end up writing one version per key type, or reaching for reflection.

```go
func SortedKeys[K cmp.Ordered, V any](m map[K]V) []K {
	keys := make([]K, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	slices.Sort(keys)
	return keys
}
```

The constraint `cmp.Ordered` tells the compiler that `K` supports `<`, which is all `slices.Sort` needs.

## When not to use them

> If an interface already describes the behaviour you need, prefer the interface.

Generics shine for containers and algorithms. For behaviour, interfaces are usually clearer:

1. Start with concrete types.
2. Extract an interface when a second implementation appears.
3. Reach for type parameters when the *shape* of the code repeats, not the behaviour.

## Wrapping up

Keep the constraint as small as possible and let the call sites read naturally. A good test: if callers need to spell out type arguments, the API probably needs another look.
