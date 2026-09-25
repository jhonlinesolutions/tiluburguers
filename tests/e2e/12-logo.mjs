export default async function ({ browser, check, BASE }) {
  for (const [w, h, min] of [[390, 844, 112], [1440, 900, 136]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(BASE, { waitUntil: 'load' });
    const badge = await page.$('.hero [data-hero-logo]');
    const box = badge ? await badge.boundingBox() : null;
    check(!!box && Math.round(box.width) >= min, `${w}px: selo do logo no hero com ${min}px (${box ? Math.round(box.width) : 'ausente'})`);
    check(!!box && box.y >= 0 && box.y + box.height <= h, `${w}px: selo visível na primeira tela`);
    const header = await page.$('[data-header] .brand img');
    const hb = header ? await header.boundingBox() : null;
    check(!!hb && Math.round(hb.width) === 56, `${w}px: logo do header com 56px (${hb ? Math.round(hb.width) : 'ausente'})`);
    await page.close();
  }
}
