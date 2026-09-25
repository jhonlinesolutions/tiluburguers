export default async function ({ browser, check, BASE }) {
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  const [bg, fg] = await page.$eval('.fab', (el) => [getComputedStyle(el).backgroundColor, getComputedStyle(el).color]);
  check(bg === 'rgb(37, 211, 102)', `botão flutuante no verde do WhatsApp (${bg})`);
  check(fg === 'rgb(255, 255, 255)', `ícone branco (${fg})`);
  await page.close();
}
