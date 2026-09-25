export default async function ({ browser, check, BASE }) {
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  const attr = async (sel, name) => (await (await page.$(sel))?.getAttribute(name)) ?? '';
  const text = async (sel) => ((await (await page.$(sel))?.textContent()) ?? '').trim();

  const src = await attr('#onde iframe', 'src');
  check(src.startsWith('https://www.google.com/maps?q=') && src.endsWith('&output=embed'), 'mapa incorporado');
  check((await attr('#onde iframe', 'loading')) === 'lazy', 'mapa com carregamento tardio');
  check((await text('#onde address')).includes('Rua Cananéia, 97'), 'endereço em texto');
  check((await attr('#onde a[href*="maps/search"]', 'target')) === '_blank', 'link Abrir no Google Maps');
  check((await attr('#onde a[href="https://www.instagram.com/tiluburguers"]', 'rel')) === 'noopener', 'link do Instagram');
  check((await attr('footer .credit a', 'href')) === 'https://jhonlinesolutions.com.br', 'crédito aponta para JH Online Solutions');
  check((await text('footer .credit a')) === 'Feito com fome por JH Online Solutions', 'texto do crédito');
  await page.close();
}
