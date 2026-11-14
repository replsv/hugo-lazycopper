---
title: "Writing a tiny HTTP router"
date: 2026-08-02
description: "Building a minimal router on top of net/http to understand what frameworks do for you."
tags: ['go', 'http']
---

Frameworks hide a lot of routing logic. Writing a small router yourself is a good way to see how little of it you actually need.

## Matching paths

Since Go 1.22, the standard `ServeMux` understands methods and wildcards, which covers most cases:

```go
mux := http.NewServeMux()
mux.HandleFunc("GET /users/{id}", getUser)
mux.HandleFunc("POST /users", createUser)
```

## Middleware

Middleware is just a function that wraps a handler:

```go
func logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s %s", r.Method, r.URL.Path, time.Since(start))
	})
}
```

Chain a few of these and you have most of what a framework router gives you.
