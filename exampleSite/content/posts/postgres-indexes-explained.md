---
title: "Postgres indexes, explained"
date: 2026-09-14
description: "B-tree, GIN, BRIN and partial indexes, and how to pick the right one."
tags: ['postgres', 'databases']
---

An index is a trade: faster reads in exchange for slower writes and more disk. Picking the right kind matters more than adding more of them. This post walks through the index types you will reach for most often, when each one fits, and how to check that Postgres actually uses the index you just created.

## B-tree

The default, and the right answer most of the time. It handles equality and range queries on anything sortable.

![A small B-tree with a root node and three leaves](/images/btree.svg)

```sql
CREATE INDEX orders_created_at_idx ON orders (created_at);
```

### Column order in multi-column indexes

A B-tree on `(customer_id, created_at)` can serve queries that filter on `customer_id` alone, or on both columns, but not on `created_at` alone. Put the column you always filter on first, and the one you sort or range over second.

### Covering indexes

When a query only needs a few columns, `INCLUDE` adds them to the index leaves so Postgres can answer it with an index-only scan, without visiting the table at all:

```sql
CREATE INDEX orders_customer_idx ON orders (customer_id) INCLUDE (total, status);
```

## GIN

Built for values that contain many keys, such as `jsonb` documents, arrays and full-text search vectors.

```sql
CREATE INDEX products_attrs_idx ON products USING gin (attributes);
```

GIN indexes are slower to update than B-trees, because one row can add dozens of entries. On write-heavy tables, keep an eye on how long inserts take after adding one.

## BRIN

Tiny indexes for huge, naturally ordered tables like append-only event logs. They store min/max values per block range instead of every row.

## Partial indexes

Index only the rows you query. An index on `WHERE status = 'pending'` stays small even when the table grows forever.

```sql
CREATE INDEX jobs_pending_idx ON jobs (run_at) WHERE status = 'pending';
```

The planner only uses it when the query's `WHERE` clause implies the index condition, so write the filter the same way in both places.

## Checking that an index is used

Adding an index doesn't mean the planner will pick it. Run the query with `EXPLAIN ANALYZE` and look for an `Index Scan` or `Bitmap Index Scan` on the table:

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE created_at > now() - interval '1 day';
```

A `Seq Scan` on a large table usually means the index doesn't match the query, the statistics are stale, or the query returns so many rows that reading the whole table is cheaper. Running `ANALYZE` on the table refreshes the statistics.

## Cleaning up

Every index slows down writes and takes space, even when nothing reads it. The `pg_stat_user_indexes` view counts how often each index was scanned since the statistics were last reset; indexes stuck at zero after a few weeks of normal traffic are good candidates to drop.
