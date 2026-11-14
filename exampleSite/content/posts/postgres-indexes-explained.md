---
title: "Postgres indexes, explained"
date: 2026-09-14
description: "B-tree, GIN, BRIN and partial indexes, and how to pick the right one."
tags: ['postgres', 'databases']
---

An index is a trade: faster reads in exchange for slower writes and more disk. Picking the right kind matters more than adding more of them.

## B-tree

The default, and the right answer most of the time. It handles equality and range queries on anything sortable.

![A small B-tree with a root node and three leaves](/images/btree.svg)

```sql
CREATE INDEX orders_created_at_idx ON orders (created_at);
```

## GIN

Built for values that contain many keys, such as `jsonb` documents, arrays and full-text search vectors.

## BRIN

Tiny indexes for huge, naturally ordered tables like append-only event logs. They store min/max values per block range instead of every row.

## Partial indexes

Index only the rows you query. An index on `WHERE status = 'pending'` stays small even when the table grows forever.
