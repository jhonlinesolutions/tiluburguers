export default async function ({ browser, check, BASE }) {
  for (const [w, h] of [[320, 640], [390, 844], [1440, 900]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(BASE, { waitUntil: 'load' });
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    check(sw <= w, `${w}px: sem rolagem horizontal (scrollWidth=${sw})`);
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE, { waitUntil: 'load' });
  check((await page.textContent('h1'))?.trim() === 'O hambúrguer raiz do Caiçara.', 'título do hero');
  const fab = await page.getAttribute('.fab', 'href', { timeout: 2000 }).catch(() => null);
  check(fab === 'https://wa.me/5531984811004?text=' + encodeURIComponent('Olá! Vim pelo site e quero fazer um pedido.'), 'FAB abre o WhatsApp com a mensagem genérica');
  const header = await page.$('[data-header]');
  check(!!header && !(await header.evaluate((h) => h.classList.contains('show-cta'))), 'topo: botão do header escondido');
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
  await page.waitForTimeout(300);
  check(!!header && (await header.evaluate((h) => h.classList.contains('show-cta'))), 'após rolar: botão do header visível');
  await page.close();

  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const rm = await ctx.newPage();
  await rm.goto(BASE, { waitUntil: 'load' });
  await rm.waitForTimeout(500);
  const video = await rm.$('[data-hero-video]');
  check(!!video && (await video.evaluate((v) => v.paused)), 'movimento reduzido: vídeo pausado');
  const anim = await rm.$eval('h1', (el) => getComputedStyle(el).animationName);
  check(anim === 'none', `movimento reduzido: título sem animação (${anim})`);
  await ctx.close();
}
