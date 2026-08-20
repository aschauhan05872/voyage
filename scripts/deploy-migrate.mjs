#!/usr/bin/env node
/**
 * Production migration step — runs `prisma migrate deploy`.
 * Exits non-zero on failure so deployment platforms abort the release.
 */
import { spawnSync } from "node:child_process";

if (!process.env.DATABASE_URL?.trim()) {
  console.error("ERROR: DATABASE_URL is required for deployment migrations.");
  process.exit(1);
}

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
