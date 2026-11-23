import { casPatch, createDocument, readById } from "./ledger";

export type CronLock = {
  _id: string;
  _rev?: string;
  _type: "cronLock";
  lockKey: string;
  owner: string;
  state: "held" | "released";
  fence: number;
  runId: string;
  acquiredAt: string;
  heartbeatAt: string;
  leaseExpiresAt: string;
  releasedAt?: string;
  lastResult?: Record<string, number>;
};

export type LockHandle = { lockId: string; rev: string; fence: number };

export async function acquireLock(args: {
  lockId: string;
  lockKey: string;
  owner: string;
  runId: string;
  ttlMs?: number;
}): Promise<{ ok: true; handle: LockHandle } | { ok: false; busy: true }> {
  const now = new Date();
  const ttl = args.ttlMs ?? 45 * 60 * 1000;
  const base: CronLock = {
    _id: args.lockId,
    _type: "cronLock",
    lockKey: args.lockKey,
    owner: args.owner,
    state: "held",
    fence: 1,
    runId: args.runId,
    acquiredAt: now.toISOString(),
    heartbeatAt: now.toISOString(),
    leaseExpiresAt: new Date(now.getTime() + ttl).toISOString(),
  };
  const created = await createDocument<CronLock>(base);
  if (created.created)
    return {
      ok: true,
      handle: { lockId: args.lockId, rev: created.doc._rev ?? "", fence: 1 },
    };

  let current = (await readById<CronLock>(args.lockId)) ?? created.doc;
  for (let i = 0; i < 3; i += 1) {
    if (
      current.leaseExpiresAt &&
      Date.parse(current.leaseExpiresAt) > Date.now() &&
      current.state === "held" &&
      current.owner !== args.owner
    ) {
      return { ok: false, busy: true };
    }
    if (!current._rev) return { ok: false, busy: true };
    const next = await casPatch<CronLock>(args.lockId, current._rev, {
      owner: args.owner,
      state: "held",
      fence: current.fence + 1,
      runId: args.runId,
      acquiredAt: now.toISOString(),
      heartbeatAt: now.toISOString(),
      leaseExpiresAt: new Date(now.getTime() + ttl).toISOString(),
      releasedAt: "",
    });
    if (next.ok) {
      return {
        ok: true,
        handle: {
          lockId: args.lockId,
          rev: next.doc._rev ?? "",
          fence: next.doc.fence,
        },
      };
    }
    const fresh = await readById<CronLock>(args.lockId);
    if (!fresh) return { ok: false, busy: true };
    current = fresh;
  }
  return { ok: false, busy: true };
}

export async function heartbeatLock(
  handle: LockHandle,
  ttlMs = 45 * 60 * 1000,
): Promise<LockHandle | null> {
  const result = await casPatch<CronLock>(handle.lockId, handle.rev, {
    heartbeatAt: new Date().toISOString(),
    leaseExpiresAt: new Date(Date.now() + ttlMs).toISOString(),
  });
  return result.ok ? { ...handle, rev: result.doc._rev ?? handle.rev } : null;
}

export async function releaseLock(
  handle: LockHandle,
  result: Record<string, number>,
): Promise<boolean> {
  const released = await casPatch<CronLock>(handle.lockId, handle.rev, {
    state: "released",
    releasedAt: new Date().toISOString(),
    leaseExpiresAt: new Date().toISOString(),
    lastResult: result,
  });
  return released.ok;
}
