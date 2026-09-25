export default async function ({ browser, check, BASE }) {
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  const text = async (sel) => ((await (await page.$(sel))?.textContent()) ?? '');
  check((await page.locator('#avaliacoes .review').count()) === 6, '6 avaliações');
  const score = (await text('#avaliacoes .score')).replace(/\s+/g, ' ');
  check(score.includes('4,5') && score.includes('42 avaliações no Google'), `nota: "${score.trim()}"`);
  check((await page.locator('#avaliacoes .reply').count()) === 1, 'uma resposta do proprietário');
  check((await text('#avaliacoes')).includes('Melhor hambúrguer de BH'), 'texto real da Isabela');
  await page.close();
}
