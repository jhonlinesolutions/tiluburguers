export default async function ({ browser, check, BASE }) {
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  const labelEl = await page.$('[data-status-label]');
  const label = ((await labelEl?.textContent()) ?? '').trim();
  check(/^(Aberto agora, fecha à 0h|Fechado agora, abre às 19h)$/.test(label), `status ao vivo: "${label}"`);
  const statusEl = await page.$('[data-status]');
  const open = (await statusEl?.getAttribute('data-open')) ?? null;
  check(open === 'true' || open === 'false', `data-open definido (${open})`);
  await page.close();

  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const nojs = await ctx.newPage();
  await nojs.goto(BASE, { waitUntil: 'load' });
  const fixed = await nojs.$('[data-status-label]');
  check(((await fixed?.textContent()) ?? '').trim() === 'Todos os dias, das 19h à 0h', 'sem JS: horário fixo');
  const bar = await nojs.$('.status');
  check(((await bar?.textContent()) ?? '').includes('sem consumo no local'), 'avisa que não tem salão');
  await ctx.close();
}
