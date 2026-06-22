/**
 * D1 database shim for local development with the Node adapter.
 * In Cloudflare Workers, the D1 binding is provided via env.DB.
 *
 * This file is imported by middleware.ts. In Node.js (local dev), it
 * loads the SQLite database from wrangler state. In Cloudflare Workers,
 * it's a no-op.
 */

type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  all: <T = unknown>() => Promise<{ results: T[]; success: boolean; meta: { changed_db: boolean; changes: number; last_row_id: number | null; duration: number } }>;
  first: <T = unknown>() => Promise<T | null>;
  run: () => Promise<{ results: unknown[]; success: boolean; meta: { changed_db: boolean; changes: number; last_row_id: number | null; duration: number } }>;
  raw: <T = unknown>() => Promise<T[]>;
};

type D1Database = {
  prepare: (sql: string) => D1PreparedStatement;
  batch: (statements: D1PreparedStatement[]) => Promise<unknown[]>;
  dump: () => Promise<ArrayBuffer>;
  exec: (sql: string) => Promise<{ count: number; duration: number }>;
};

// Only run in Node.js local dev (not in Cloudflare Workers)
if (typeof process !== 'undefined' && process.versions?.node && !globalThis.__D1__) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require('better-sqlite3');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { readdirSync, existsSync } = require('node:fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { join } = require('node:path');

    const stateDir = join(process.cwd(), '.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');

    if (existsSync(stateDir)) {
      const files = readdirSync(stateDir);
      const sqliteFile = files.find((f: string) => f.endsWith('.sqlite'));

      if (sqliteFile) {
        const db = new Database.default(join(stateDir, sqliteFile), { readonly: false });
        db.pragma('journal_mode = WAL');

        const shim: D1Database = {
          prepare: (sql: string) => {
            const stmt = db.prepare(sql);
            let boundArgs: unknown[] = [];
            const bound: D1PreparedStatement = {
              bind: (...values: unknown[]) => { boundArgs = values; return bound; },
              first: <T = unknown>() => Promise.resolve((stmt.get(...boundArgs) as T | undefined) ?? null),
              all: <T = unknown>() => Promise.resolve({
                results: stmt.all(...boundArgs) as T[],
                success: true as const,
                meta: { changed_db: false, changes: 0, last_row_id: null, duration: 0 },
              }),
              run: () => {
                const info = stmt.run(...boundArgs);
                return Promise.resolve({
                  results: [] as unknown[],
                  success: true as const,
                  meta: { changed_db: info.changes > 0, changes: info.changes, last_row_id: Number(info.lastInsertRowid), duration: 0 },
                });
              },
              raw: <T = unknown>() => Promise.resolve(stmt.all(...boundArgs) as T[]),
            };
            return bound;
          },
          batch: (stmts: D1PreparedStatement[]) => {
            const tx = db.transaction(() => { for (const s of stmts) s.run(); });
            tx();
            return Promise.resolve([]);
          },
          dump: () => Promise.resolve(new ArrayBuffer(0)),
          exec: () => Promise.resolve({ count: 0, duration: 0 }),
        };

        (globalThis as Record<string, unknown>).__D1__ = shim;
      }
    }
  } catch {
    // better-sqlite3 not available — running in Cloudflare Workers, D1 binding comes from env
  }
}
