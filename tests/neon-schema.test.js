import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const sql = await readFile(new URL("../database/neon/001_schema.sql", import.meta.url), "utf8");
const tables = ["businesses","products","customers","suppliers","sales","sale_items","purchases","purchase_items","stock_movements","cash_closures"];

test("Neon schema defines all POS tenant tables", () => {
  for (const table of tables) assert.match(sql, new RegExp("create table if not exists public\\." + table + "\\b", "i"));
});

test("every tenant table is covered by owner-only RLS policy", () => {
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /owner_id = \(select auth\.user_id\(\)\)/i);
  for (const table of tables) assert.match(sql, new RegExp("'" + table + "'"));
});

test("client roles receive no anonymous access and owner_id is JWT-derived", () => {
  assert.match(sql, /owner_id text not null default auth\.user_id\(\)/i);
  assert.doesNotMatch(sql, /to anonymous/i);
  assert.doesNotMatch(sql, /grant .* to public/i);
});
