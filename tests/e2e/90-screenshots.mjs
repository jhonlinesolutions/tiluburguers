import { mkdirSync } from 'node:fs';

export default async function ({ browser, check, BASE }) {
  mkdirSync('screenshots', { recursive: true });
  for (const [w, h] of [[320, 640], [390, 844], [1440, 900]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `screenshots/${w}-topo.png` });
    await page.screenshot({ path: `screenshots/${w}-inteira.png`, fullPage: true });
    await page.locator('#cardapio').screenshot({ path: `screenshots/${w}-cardapio.png` });
    check(true, `capturas ${w}px`);
    await page.close();
  }
}
