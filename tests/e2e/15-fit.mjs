export default async function ({ browser, check, BASE }) {
  for (const [w, h] of [[320, 640], [360, 740], [390, 844], [1024, 768], [1440, 900]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(BASE, { waitUntil: 'load' });
    const t = await page.$eval('h1', (el) => [el.scrollWidth, el.clientWidth]);
    check(t[0] <= t[1], `${w}px: título do hero cabe inteiro (${t[0]}/${t[1]})`);
    const tabs = await page.$eval('[data-tablist]', (el) => [el.scrollWidth, el.clientWidth]);
    check(tabs[0] <= tabs[1], `${w}px: todas as abas do cardápio visíveis (${tabs[0]}/${tabs[1]})`);
    await page.close();
  }
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  const hidesGlyph = await page.evaluate(() =>
    [...document.styleSheets].some((s) => {
      try { return [...s.cssRules].some((r) => r.cssText.includes('media-controls-start-playback-button')); }
      catch { return false; }
    }),
  );
  check(hidesGlyph, 'iOS: ícone de play nativo escondido sobre o poster');
  await page.close();
}
