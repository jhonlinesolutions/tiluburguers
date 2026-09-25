import { preview } from 'astro';
import { chromium } from 'playwright';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const PORT = 4321;
const BASE = `http://localhost:${PORT}/`;
const dir = path.resolve('tests/e2e');
const failures = [];
const check = (cond, msg) => {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${msg}`);
  if (!cond) failures.push(msg);
};

const server = await preview({ root: process.cwd(), server: { port: PORT }, logLevel: 'warn' });
const browser = await chromium.launch();
try {
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.mjs')).sort()) {
    console.log(`\n# ${f}`);
    const mod = await import(pathToFileURL(path.join(dir, f)).href);
    await mod.default({ browser, check, BASE });
  }
} finally {
  await browser.close();
  await server.stop();
}
if (failures.length) {
  console.error(`\n${failures.length} falha(s)`);
  process.exit(1);
}
console.log('\nsmoke ok');
