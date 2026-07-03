# D4 Loot Filter Builder

A client-side web application that generates Diablo IV loot filter import strings — a Base64-encoded Protocol Buffer payload the game client accepts natively.

The core idea is an inheritance-based logic engine: users define global stat-weight baselines that cascade to every gear slot, with the ability to override individual slots. A client-side compiler then flattens and compresses this into the flat, top-to-bottom, 25-rule-max structure the D4 client enforces, before serializing it with protobuf.js.

**Status:** Architecture and UX are still being designed. See the open UX/Architecture Design Spike issue before picking up implementation work — the interaction model (layout paradigm, inheritance visualization, condition-building UX, live test bench) is not yet finalized.
