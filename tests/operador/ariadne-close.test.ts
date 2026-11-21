import assert from "node:assert/strict";
import test from "node:test";
import {
  closeApi,
  CloseApiError,
  retryWrite,
  SelectionEpoch,
} from "../../src/lib/ariadne/closeApi.ts";

test("selection epochs discard out-of-order workspace/item responses", async () => {
  const epoch = new SelectionEpoch();
  const old = epoch.next();
  let rendered = "";
  let completeOld!: (value: string) => void;
  const delayed = new Promise<string>((resolve) => {
    completeOld = resolve;
  }).then((value) => {
    if (epoch.current(old)) rendered = value;
  });
  const latest = epoch.next();
  if (epoch.current(latest)) rendered = "workspace B / item B";
  completeOld("workspace A / item A");
  await delayed;
  assert.equal(rendered, "workspace B / item B");
});

test("lost response retries exactly the same write, definitive error does not retry", async () => {
  let calls = 0;
  assert.equal(
    await retryWrite(async () => {
      if (++calls === 1) throw new CloseApiError(0, "lost");
      return "committed identity";
    }),
    "committed identity",
  );
  assert.equal(calls, 2);
  calls = 0;
  await assert.rejects(
    retryWrite(async () => {
      calls++;
      throw new CloseApiError(409, "stale");
    }),
  );
  assert.equal(calls, 1);
});

test("commit/lost response then expired session retains write key across reauthentication", async () => {
  const memory = new Map<string, string>();
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: {
      getItem: (k: string) => memory.get(k) ?? null,
      setItem: (k: string, v: string) => memory.set(k, v),
      removeItem: (k: string) => memory.delete(k),
    },
  });
  const original = globalThis.fetch;
  const keys: string[] = [];
  const paths: string[] = [];
  let call = 0;
  globalThis.fetch = async (path, init) => {
    paths.push(String(path));
    keys.push(new Headers(init?.headers).get("Idempotency-Key")!);
    assert.equal(init?.credentials, "include");
    if (++call === 1) throw new Error("lost after commit");
    if (call === 2)
      return new Response(JSON.stringify({ detail: "expired" }), {
        status: 401,
      });
    return new Response(JSON.stringify({ id: "saved-once" }), { status: 201 });
  };
  try {
    await assert.rejects(
      closeApi.save("workspace", "review", "result"),
      (e) => e instanceof CloseApiError && e.status === 401,
    );
    assert.equal(memory.size, 1);
    assert.equal(
      (await closeApi.save("workspace", "review", "result")).id,
      "saved-once",
    );
    assert.equal(new Set(keys).size, 1);
    assert.equal(memory.size, 0);
    assert.ok(paths.every((p) => p.startsWith("/api/")));
  } finally {
    globalThis.fetch = original;
  }
});
