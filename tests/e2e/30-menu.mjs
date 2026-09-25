export default async function ({ browser, check, BASE }) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.setDefaultTimeout(3000);
  await page.goto(BASE, { waitUntil: 'load' });
  const safe = (p) => p.catch(() => null);

  check((await page.locator('.panel:visible').count()) === 1, 'com JS: um painel visível');
  check(await page.locator('#painel-classicos').isVisible(), 'começa em Clássicos');

  const picanha = page.getByRole('tab', { name: 'Picanha' });
  await safe(picanha.click());
  check(await page.locator('#painel-picanha').isVisible(), 'clique em Picanha mostra o painel');
  check((await safe(picanha.getAttribute('aria-selected'))) === 'true', 'aba Picanha marcada');
  await safe(picanha.press('ArrowRight'));
  check(await page.locator('#painel-acrescimos').isVisible(), 'seta → vai para Acréscimos');
  await page.keyboard.press('End');
  check(await page.locator('#painel-bebidas').isVisible(), 'End vai para Bebidas');
  await page.keyboard.press('ArrowRight');
  check(await page.locator('#painel-classicos').isVisible(), 'seta → no fim volta para Clássicos');

  const href = await safe(page.locator('#painel-picanha a.order').first().getAttribute('href'));
  const msg = decodeURIComponent((href ?? '').split('?text=')[1] ?? '');
  check(msg === 'Olá! Quero pedir um X-Bacon Picanha (R$ 23,00).', `link do X-Bacon Picanha: "${msg}"`);
  check((await page.locator('#painel-acrescimos a.order').count()) === 0, 'acréscimos sem botão Pedir');
  check((await page.locator('a.order').count()) === 17, '17 lanches com botão Pedir');
  await page.close();

  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const nojs = await ctx.newPage();
  await nojs.goto(BASE, { waitUntil: 'load' });
  check((await nojs.locator('.panel:visible').count()) === 4, 'sem JS: 4 categorias empilhadas');
  check((await nojs.locator('[data-tablist]').count()) === 1 && !(await nojs.locator('[data-tablist]').isVisible()), 'sem JS: abas ocultas');
  check(await nojs.getByRole('heading', { name: 'Picanha' }).isVisible(), 'sem JS: títulos das categorias visíveis');
  await ctx.close();
}
