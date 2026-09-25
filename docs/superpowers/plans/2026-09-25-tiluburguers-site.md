# Tilu Burguers: site protótipo (plano de implementação)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Site estático de uma página para a Tiluburguer's (hero em vídeo, status aberto/fechado, cardápio em abas com pedido via WhatsApp, avaliações, localização), com deploy na Vercel em `tiluburguers.jhonlinesolutions.com.br`.

**Architecture:** Astro com saída estática. Conteúdo em `src/data/` (cardápio, dados do negócio e textos); lógica pura em `src/lib/`, testada com Vitest; componentes `.astro` com CSS escopado e tokens globais; JS mínimo no navegador (status, abas, header, vídeo). Um runner Playwright (`npm run smoke`) sobe o `astro preview` e roda as verificações de navegador de cada seção.

**Tech Stack:** Node 24, Astro (latest), TypeScript, Vitest, Playwright (chromium), @fontsource (Titan One, Barlow, Barlow Condensed), simple-icons.

**Spec:** `docs/superpowers/specs/2026-09-25-tiluburguers-site-design.md`

## Global Constraints

- Idioma do site: pt-BR (`<html lang="pt-BR">`). Frases em caixa normal; sem etiquetas em caixa alta; sem "→" em botões; sem numeração 01/02/03.
- WhatsApp: `5531984811004`. Mensagem genérica: `Olá! Vim pelo site e quero fazer um pedido.` Por item: `Olá! Quero pedir um ${nome} (${formatBRL(preco)}).`
- Horário: 19h–0h, todos os dias, fuso `America/Sao_Paulo`. Rótulos: `Aberto agora, fecha à 0h` / `Fechado agora, abre às 19h`. Sem JS: `Todos os dias, das 19h à 0h`.
- Tokens de cor: `--chapa #17120F`, `--laranja #F28C1B` (ajustado ao logo na Task 1), `--cheddar #F6B830`, `--kraft #E9DCC4`, `--osso #FFF6EA`, `--tinta #2A211B`, `--osso-suave #CBBFAF`, `--tinta-suave #5A4A3E`. Todos os pares de texto com contraste AA (≥ 4,5:1).
- Fontes: Titan One (títulos), Barlow Condensed 600/700 (nomes, preços, abas, botões), Barlow 400/500 (corpo). Servidas pelo próprio site via @fontsource.
- Uma única animação não disparada pelo usuário: a entrada do título do hero. Com `prefers-reduced-motion: reduce`, não há animação e o vídeo fica pausado no poster.
- Os componentes não contêm texto de conteúdo embutido: textos vêm de `src/data/business.ts` e `src/data/menu.ts` (rótulos de navegação e botões curtos de UI podem ficar no componente).
- Sem SEO além de `<title>`, favicon e `lang`. Sem backend, carrinho, analytics ou menção a IA.
- Rodapé: `Feito com fome por JH Online Solutions` → `https://jhonlinesolutions.com.br`.
- Links externos: `target="_blank" rel="noopener"`.
- Commits pequenos, em pt-BR, terminando com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Todos os comandos rodam na raiz do repositório: `D:\Coding Projects\Claude Code\tilufood` (Git Bash).

## Review Focus

1. **Meia-noite em BH:** `Intl` pode formatar 0h como "24". Entre 00:00 e 00:59 a loja deve aparecer como fechada (teste na Task 2).
2. **Nomes repetidos entre categorias** ("X-Bacon" existe nas duas linhas): a mensagem do WhatsApp precisa identificar o lanche sem ambiguidade. Os nomes são únicos no cardápio inteiro (teste na Task 4) e o link do "X-Bacon Picanha" é verificado no navegador (Task 7).
3. **Telas estreitas de 320px** com nomes longos ("X-Egg Bacon Especial", "Americano Especial"): nada de rolagem horizontal (checagem em 320/390/1440 na Task 5, que roda de novo a cada seção nova).
4. **Visitante sem JavaScript:** as 4 categorias aparecem empilhadas, as abas ficam ocultas e o status mostra o horário fixo (Tasks 6 e 7).
5. **Movimento reduzido:** o vídeo fica pausado no poster e o título não anima (Task 5).

---

### Task 1: Base do projeto, assets e tokens

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`
- Create: `public/video/hero.mp4`, `public/video/hero-poster.jpg`, `public/logo-tiluburguers.jpg`, `public/favicon.png`
- Create: `src/styles/global.css`, `src/layouts/Base.astro`, `src/pages/index.astro`
- Test: `tests/contrast.test.ts`

**Interfaces:**
- Produces: `Base.astro` com a prop `title: string`; classes globais `.wrap`, `.btn`, `.btn-sm`, `.sr-only`; tokens CSS listados em Global Constraints; scripts npm `dev`, `build`, `preview`, `check`, `test`, `smoke`.

- [ ] **Step 1: Criar o package.json e instalar as dependências**

```bash
npm init -y
npm pkg set type=module
npm pkg set scripts.dev="astro dev" scripts.build="astro build" scripts.preview="astro preview" scripts.check="astro check" scripts.test="vitest run" scripts.smoke="node scripts/smoke.mjs"
npm install astro@latest @fontsource/titan-one @fontsource/barlow @fontsource/barlow-condensed simple-icons
npm install -D vitest typescript @astrojs/check playwright
npx playwright install chromium
```

- [ ] **Step 2: Arquivos de configuração**

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tiluburguers.jhonlinesolutions.com.br',
});
```

`tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", ".tools"]
}
```

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['tests/**/*.test.ts'] },
});
```

`.gitignore`:
```
node_modules/
dist/
.astro/
.tools/
screenshots/
.vercel/
.DS_Store
```

- [ ] **Step 3: Copiar e gerar os assets**

O poster e o favicon são gerados com OpenCV, instalado numa pasta local ignorada pelo git (`.tools/`). O mesmo script mede o laranja do logo.

```bash
mkdir -p public/video
cp img/animation.mp4 public/video/hero.mp4
cp img/logo-tiluburguers.jpg public/logo-tiluburguers.jpg
python -m pip install -q --target .tools/py opencv-python-headless numpy
PYTHONPATH=.tools/py python - <<'EOF'
import cv2, numpy as np
cap = cv2.VideoCapture('img/animation.mp4')
ok, frame = cap.read()
assert ok, 'não leu o 1º frame'
cv2.imwrite('public/video/hero-poster.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
logo = cv2.imread('img/logo-tiluburguers.jpg')
cv2.imwrite('public/favicon.png', cv2.resize(logo, (64, 64), interpolation=cv2.INTER_AREA))
hsv = cv2.cvtColor(logo, cv2.COLOR_BGR2HSV)
mask = (hsv[..., 0] >= 8) & (hsv[..., 0] <= 22) & (hsv[..., 1] > 150) & (hsv[..., 2] > 150)
b, g, r = np.median(logo[mask], axis=0).astype(int)
print('laranja do logo: #%02X%02X%02X' % (r, g, b))
EOF
```
Expected: `public/video/hero-poster.jpg` (376×480) e `public/favicon.png` criados; uma linha `laranja do logo: #XXXXXX`. **Anote esse hex.** No Step 4, use-o em `--laranja` no lugar de `#F28C1B`, desde que o teste de contraste continue passando. Se não passar, mantenha `#F28C1B`.

- [ ] **Step 4: Escrever o teste de contraste (falha: global.css ainda não existe)**

`tests/contrast.test.ts`:
```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');

function token(name: string): string {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`token --${name} não encontrado`);
  return m[1];
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [texto, fundo, mínimo]
const pairs: [string, string, number][] = [
  ['osso', 'chapa', 4.5],
  ['osso-suave', 'chapa', 4.5],
  ['cheddar', 'chapa', 4.5],
  ['laranja', 'chapa', 4.5],
  ['chapa', 'laranja', 4.5],
  ['chapa', 'cheddar', 4.5],
  ['tinta', 'kraft', 4.5],
  ['tinta-suave', 'kraft', 4.5],
  ['kraft', 'tinta', 4.5],
];

describe('contraste dos tokens', () => {
  it.each(pairs)('%s sobre %s ≥ %d:1', (fg, bg, min) => {
    expect(ratio(token(fg), token(bg))).toBeGreaterThanOrEqual(min);
  });
});
```

Run: `npm test`
Expected: FAIL com `ENOENT` (global.css não existe).

- [ ] **Step 5: Criar global.css**

`src/styles/global.css` (troque `#F28C1B` pelo hex do Step 3, se aplicável):
```css
:root {
  --chapa: #17120F;
  --laranja: #F28C1B;
  --cheddar: #F6B830;
  --kraft: #E9DCC4;
  --osso: #FFF6EA;
  --tinta: #2A211B;
  --osso-suave: #CBBFAF;
  --tinta-suave: #5A4A3E;

  --f-display: 'Titan One', system-ui, sans-serif;
  --f-cond: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  --f-body: 'Barlow', system-ui, sans-serif;

  --gutter: clamp(16px, 5vw, 48px);
  --max: 1120px;
}

*, *::before, *::after { box-sizing: border-box; }
[hidden] { display: none !important; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--chapa);
  color: var(--osso);
  font: 400 1.0625rem/1.55 var(--f-body);
}
img, video, iframe { display: block; max-width: 100%; }
a { color: inherit; }
:focus-visible { outline: 3px solid var(--cheddar); outline-offset: 3px; }

h1, h2 { font-family: var(--f-display); font-weight: 400; line-height: 1.02; margin: 0; }
h2 { font-size: clamp(2.25rem, 7vw, 3.5rem); }
section[id] { scroll-margin-top: 72px; }

.wrap { width: min(100% - 2 * var(--gutter), var(--max)); margin-inline: auto; }
.sr-only {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap;
}

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: .5em;
  min-height: 48px; padding: .75em 1.4em;
  border-radius: 999px; background: var(--laranja); color: var(--chapa);
  font: 700 1.25rem/1 var(--f-cond); letter-spacing: .01em; text-decoration: none;
}
.btn:hover { background: var(--cheddar); }
.btn-sm { min-height: 40px; padding: .5em 1.1em; font-size: 1.05rem; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

Run: `npm test`
Expected: PASS (9 testes).

- [ ] **Step 6: Layout base e página provisória**

`src/layouts/Base.astro`:
```astro
---
import '@fontsource/titan-one/400.css';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '../styles/global.css';

interface Props {
  title: string;
}
const { title } = Astro.props;
---
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#17120F" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

`src/pages/index.astro` (provisório; a Task 5 substitui):
```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Tiluburguer's">
  <main class="wrap"><h1>Tiluburguer's</h1></main>
</Base>
```

- [ ] **Step 7: Verificar o build**

Run: `npm run build && npm run check`
Expected: build completa com `dist/index.html`; `astro check` com 0 erros.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts .gitignore public src tests
git commit -m "chore: base Astro, assets e tokens de cor

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Dados do negócio e status aberto/fechado

**Files:**
- Create: `src/data/business.ts`, `src/lib/openStatus.ts`
- Test: `tests/openStatus.test.ts`

**Interfaces:**
- Produces:
  - `business: Business` (campos abaixo), `interface Review { author: string; text: string; ownerReply?: string }`
  - `openStatus(now: Date, hours?: {opensAt: number; closesAt: number}, timeZone?: string): { open: boolean; label: string }`
  - `hourIn(now: Date, timeZone: string): number` (0–23)

- [ ] **Step 1: Criar business.ts**

`src/data/business.ts`:
```ts
export interface Review {
  author: string;
  text: string;
  ownerReply?: string;
}

export interface Business {
  name: string;
  tagline: string;
  whatsapp: string;
  instagram: string;
  instagramHandle: string;
  address: { street: string; district: string; city: string; state: string; zip: string };
  timeZone: string;
  hours: { opensAt: number; closesAt: number };
  hoursLabel: string;
  serviceLabel: string;
  rating: { value: number; count: number; source: string };
  credit: { label: string; url: string };
  copy: {
    heroTitle: string;
    heroLede: string;
    orderCta: string;
    menuTitle: string;
    reviewsTitle: string;
    locationTitle: string;
  };
  reviews: Review[];
}

export const business: Business = {
  name: "Tiluburguer's",
  tagline: 'O Hambúrguer Raiz',
  whatsapp: '5531984811004',
  instagram: 'https://www.instagram.com/tiluburguers',
  instagramHandle: '@tiluburguers',
  address: {
    street: 'Rua Cananéia, 97',
    district: 'Caiçara',
    city: 'Belo Horizonte',
    state: 'MG',
    zip: '30770-120',
  },
  timeZone: 'America/Sao_Paulo',
  hours: { opensAt: 19, closesAt: 24 },
  hoursLabel: 'Todos os dias, das 19h à 0h',
  serviceLabel: 'Delivery e retirada no Caiçara, sem consumo no local.',
  rating: { value: 4.5, count: 42, source: 'Google' },
  credit: { label: 'Feito com fome por JH Online Solutions', url: 'https://jhonlinesolutions.com.br' },
  copy: {
    heroTitle: 'O hambúrguer raiz do Caiçara.',
    heroLede: 'Feito na chapa, bem recheado. Delivery e retirada todos os dias, das 19h à meia-noite.',
    orderCta: 'Pedir no WhatsApp',
    menuTitle: 'Cardápio',
    reviewsTitle: 'Quem pede, volta.',
    locationTitle: 'Onde estamos',
  },
  reviews: [
    {
      author: 'Isabela',
      text: 'Melhor hambúrguer de BH, o hambúrguer mais recheado que já comi aqui, vale demais!',
      ownerReply: 'Obrigado Isabela',
    },
    {
      author: 'Gabrielle L.',
      text: 'Tinha muito tempo que não comia um sanduíche raiz tão saboroso. Fomos achando que era um lugar para comer no local, mas o estabelecimento é para retirada. Aliás, não posso deixar de comentar que o cheiro na porta estava uma delícia, um dos…',
    },
    {
      author: 'Eder J.',
      text: 'Sempre peço lá, atendimento ótimo e o hambúrguer é delicioso. Só insumo de qualidade. Podem pedir sem medo, se tiver alguém reclamando é porque comeu errado. Nota 10',
    },
    {
      author: 'Fernando T.',
      text: 'Hambúrguer simplesmente delicioso! Quase passei direto, pois não sabia que era só delivery e uma moça muito atenciosa saiu da casa e fiz o pedido com ela. Eu estava com um pouco de pressa e eles providenciaram com agilidade meu lanche.',
    },
    { author: 'Rosimar O.', text: 'Melhor hambúrguer que já comi em minha vida.' },
    { author: 'Derly D.', text: 'Adorei o sanduíche, muito bem feito e muito gostoso. Parabéns' },
  ],
};
```

- [ ] **Step 2: Escrever os testes que falham**

BH usa UTC−3 o ano todo (sem horário de verão desde 2019), então 19:00 em BH = 22:00Z.

`tests/openStatus.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { hourIn, openStatus } from '../src/lib/openStatus';

const at = (iso: string) => openStatus(new Date(iso));

describe('hourIn', () => {
  it('converte UTC para a hora de BH', () => {
    expect(hourIn(new Date('2026-09-25T22:30:00Z'), 'America/Sao_Paulo')).toBe(19);
  });
  it('meia-noite em BH é 0, nunca 24', () => {
    expect(hourIn(new Date('2026-09-26T03:00:00Z'), 'America/Sao_Paulo')).toBe(0);
  });
});

describe('openStatus (horário de BH)', () => {
  it('18:59 fechado', () => expect(at('2026-09-25T21:59:00Z').open).toBe(false));
  it('19:00 aberto', () => expect(at('2026-09-25T22:00:00Z').open).toBe(true));
  it('19:30 aberto', () => expect(at('2026-09-25T22:30:00Z').open).toBe(true));
  it('23:59 aberto', () => expect(at('2026-09-26T02:59:00Z').open).toBe(true));
  it('00:00 fechado', () => expect(at('2026-09-26T03:00:00Z').open).toBe(false));
  it('00:10 fechado', () => expect(at('2026-09-26T03:10:00Z').open).toBe(false));
  it('03:00 fechado', () => expect(at('2026-09-26T06:00:00Z').open).toBe(false));
  it('meio-dia fechado', () => expect(at('2026-09-25T15:00:00Z').open).toBe(false));

  it('rótulo quando aberto', () => {
    expect(at('2026-09-25T22:30:00Z').label).toBe('Aberto agora, fecha à 0h');
  });
  it('rótulo quando fechado', () => {
    expect(at('2026-09-25T15:00:00Z').label).toBe('Fechado agora, abre às 19h');
  });
});
```

Run: `npm test -- openStatus`
Expected: FAIL (`Cannot find module '../src/lib/openStatus'`).

- [ ] **Step 3: Implementar openStatus**

`src/lib/openStatus.ts`:
```ts
import { business } from '../data/business';

export interface OpenStatus {
  open: boolean;
  label: string;
}

export function hourIn(now: Date, timeZone: string): number {
  const part = new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', hourCycle: 'h23' })
    .formatToParts(now)
    .find((p) => p.type === 'hour');
  return Number(part?.value ?? 0) % 24;
}

function at(hour: number): string {
  const h = hour % 24;
  return `${h <= 1 ? 'à' : 'às'} ${h}h`;
}

export function openStatus(
  now: Date,
  hours = business.hours,
  timeZone = business.timeZone,
): OpenStatus {
  const h = hourIn(now, timeZone);
  const open = h >= hours.opensAt && h < hours.closesAt;
  return open
    ? { open, label: `Aberto agora, fecha ${at(hours.closesAt)}` }
    : { open, label: `Fechado agora, abre ${at(hours.opensAt)}` };
}
```

Run: `npm test -- openStatus`
Expected: PASS (12 testes).

- [ ] **Step 4: Commit**

```bash
git add src/data/business.ts src/lib/openStatus.ts tests/openStatus.test.ts
git commit -m "feat: dados do negócio e status aberto/fechado no fuso de BH

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Formatação de preço, links do WhatsApp e do Maps

**Files:**
- Create: `src/lib/format.ts`, `src/lib/whatsapp.ts`, `src/lib/maps.ts`
- Test: `tests/format.test.ts`, `tests/whatsapp.test.ts`, `tests/maps.test.ts`

**Interfaces:**
- Consumes: `business` (Task 2).
- Produces:
  - `formatBRL(n: number): string` → `"R$ 18,00"` (espaço comum, não NBSP)
  - `GENERIC_ORDER_MESSAGE: string`
  - `waLink(message?: string, phone?: string): string`
  - `itemOrderMessage(name: string, price: number): string`
  - `mapsQuery(): string`, `mapsEmbedUrl(): string`, `mapsLinkUrl(): string`

- [ ] **Step 1: Escrever os testes que falham**

`tests/format.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { formatBRL } from '../src/lib/format';

describe('formatBRL', () => {
  it('inteiro', () => expect(formatBRL(18)).toBe('R$ 18,00'));
  it('com centavos', () => expect(formatBRL(2.5)).toBe('R$ 2,50'));
  it('usa espaço comum', () => expect(formatBRL(6)).not.toContain('\u00a0'));
});
```

`tests/whatsapp.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { GENERIC_ORDER_MESSAGE, itemOrderMessage, waLink } from '../src/lib/whatsapp';

describe('waLink', () => {
  it('sem mensagem', () => expect(waLink()).toBe('https://wa.me/5531984811004'));
  it('mensagem genérica codificada', () => {
    const url = waLink(GENERIC_ORDER_MESSAGE);
    expect(url.startsWith('https://wa.me/5531984811004?text=')).toBe(true);
    expect(decodeURIComponent(url.split('?text=')[1])).toBe('Olá! Vim pelo site e quero fazer um pedido.');
  });
  it('codifica acentos, parênteses, & e espaços', () => {
    const url = waLink('Laçador (R$ 22,00) & coca');
    expect(url.split('?text=')[1]).not.toMatch(/[ &çã]/);
    expect(decodeURIComponent(url.split('?text=')[1])).toBe('Laçador (R$ 22,00) & coca');
  });
});

describe('itemOrderMessage', () => {
  it('monta a frase com nome e preço', () => {
    expect(itemOrderMessage('X-Bacon Picanha', 23)).toBe('Olá! Quero pedir um X-Bacon Picanha (R$ 23,00).');
  });
});
```

`tests/maps.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { mapsEmbedUrl, mapsLinkUrl, mapsQuery } from '../src/lib/maps';

describe('maps', () => {
  it('consulta com endereço completo', () => {
    expect(mapsQuery()).toBe('Rua Cananéia, 97, Caiçara, Belo Horizonte - MG, 30770-120');
  });
  it('embed sem chave de API', () => {
    expect(mapsEmbedUrl()).toBe(`https://www.google.com/maps?q=${encodeURIComponent(mapsQuery())}&output=embed`);
  });
  it('link para abrir no app', () => {
    expect(mapsLinkUrl()).toBe(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery())}`);
  });
});
```

Run: `npm test`
Expected: FAIL nos três arquivos novos (módulos inexistentes).

- [ ] **Step 2: Implementar**

`src/lib/format.ts`:
```ts
export function formatBRL(n: number): string {
  return `R$ ${n.toFixed(2).replace('.', ',')}`;
}
```

`src/lib/whatsapp.ts`:
```ts
import { business } from '../data/business';
import { formatBRL } from './format';

export const GENERIC_ORDER_MESSAGE = 'Olá! Vim pelo site e quero fazer um pedido.';

export function waLink(message?: string, phone = business.whatsapp): string {
  const base = `https://wa.me/${phone}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function itemOrderMessage(name: string, price: number): string {
  return `Olá! Quero pedir um ${name} (${formatBRL(price)}).`;
}
```

`src/lib/maps.ts`:
```ts
import { business } from '../data/business';

export function mapsQuery(): string {
  const a = business.address;
  return `${a.street}, ${a.district}, ${a.city} - ${a.state}, ${a.zip}`;
}

export function mapsEmbedUrl(): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery())}&output=embed`;
}

export function mapsLinkUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery())}`;
}
```

Run: `npm test`
Expected: PASS em todos os arquivos.

- [ ] **Step 3: Commit**

```bash
git add src/lib tests
git commit -m "feat: preço em BRL, links do WhatsApp e do Google Maps

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Dados do cardápio

**Files:**
- Create: `src/data/menu.ts`
- Test: `tests/menu.test.ts`

**Interfaces:**
- Produces:
  - `interface MenuEntry { name: string; ingredients?: string; price: number }`
  - `interface MenuCategory { id: string; title: string; note: string; orderable: boolean; items: MenuEntry[] }`
  - `menu: MenuCategory[]`, na ordem: `classicos`, `picanha`, `acrescimos`, `bebidas`

- [ ] **Step 1: Escrever os testes que falham**

`tests/menu.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { menu } from '../src/data/menu';

const all = menu.flatMap((c) => c.items);

describe('cardápio', () => {
  it('categorias na ordem certa', () => {
    expect(menu.map((c) => c.id)).toEqual(['classicos', 'picanha', 'acrescimos', 'bebidas']);
  });
  it('quantidade de itens por categoria', () => {
    expect(menu.map((c) => c.items.length)).toEqual([13, 4, 12, 3]);
  });
  it('só lanches são pedidos individualmente', () => {
    expect(menu.map((c) => c.orderable)).toEqual([true, true, false, false]);
  });
  it('todo item tem nome e preço positivo', () => {
    for (const i of all) {
      expect(i.name.trim()).not.toBe('');
      expect(i.price).toBeGreaterThan(0);
    }
  });
  it('todo lanche tem ingredientes', () => {
    for (const c of menu.filter((c) => c.orderable)) {
      for (const i of c.items) expect(i.ingredients?.trim()).toBeTruthy();
    }
  });
  it('nomes únicos no cardápio inteiro (mensagem do WhatsApp sem ambiguidade)', () => {
    const names = all.map((i) => i.name);
    expect(new Set(names).size).toBe(names.length);
  });
  it('preços conferem com o cardápio impresso (amostra)', () => {
    const price = (n: string) => all.find((i) => i.name === n)?.price;
    expect(price('X-Burguer')).toBe(17);
    expect(price('Tilu Especial')).toBe(26);
    expect(price('X-Tudo Picanha')).toBe(28);
    expect(price('Catupiry')).toBe(4);
    expect(price('Mate Couro 1 litro, tradicional')).toBe(8);
  });
});
```

Run: `npm test -- menu`
Expected: FAIL (módulo inexistente).

- [ ] **Step 2: Implementar menu.ts**

`src/data/menu.ts`:
```ts
export interface MenuEntry {
  name: string;
  ingredients?: string;
  price: number;
}

export interface MenuCategory {
  id: string;
  title: string;
  note: string;
  orderable: boolean;
  items: MenuEntry[];
}

export const menu: MenuCategory[] = [
  {
    id: 'classicos',
    title: 'Clássicos',
    note: 'Com hambúrguer de 56g.',
    orderable: true,
    items: [
      { name: 'X-Burguer', ingredients: 'Pão, hambúrguer 56g, queijo, presunto, alface, tomate, milho, batata palha', price: 17 },
      { name: 'X-Egg', ingredients: 'Pão, hambúrguer 56g, ovo, queijo, alface, tomate, milho, batata palha', price: 17 },
      { name: 'X-Bacon', ingredients: 'Pão, hambúrguer 56g, queijo, bacon, alface, tomate, milho, batata palha', price: 18 },
      { name: 'X-Lucheddar', ingredients: 'Pão, hambúrguer 56g, queijo, bacon, cheddar, alface, tomate, milho, batata palha', price: 19 },
      { name: 'X-Egg Bacon', ingredients: 'Pão, hambúrguer 56g, queijo, bacon, ovo, alface, tomate, milho, batata palha', price: 19 },
      { name: 'X-Lulu', ingredients: 'Pão, 2 hambúrgueres 56g, frango desfiado, catupiry, queijo, presunto, alface, tomate, milho, batata palha', price: 20 },
      { name: 'X-Tilulu', ingredients: 'Pão, hambúrguer 56g, frango desfiado, queijo, catupiry, bacon, alface, tomate, milho e batata palha', price: 22 },
      { name: 'Laçador', ingredients: 'Pão, hambúrguer 56g, frango desfiado, catupiry, queijo, presunto, bacon, ovo, alface, tomate, milho, batata palha', price: 22 },
      { name: 'X-Americano', ingredients: 'Pão, hambúrguer 56g, queijo, presunto, bacon, ovo, cheddar, alface, tomate, milho, batata palha', price: 22 },
      { name: 'X-Galinha', ingredients: 'Pão, frango desfiado, catupiry, queijo, presunto, bacon, ovo, alface, tomate, milho, batata palha', price: 23 },
      { name: 'Americano Especial', ingredients: 'Pão, 2 hambúrgueres 56g, frango desfiado, catupiry, queijo, presunto, bacon, alface, tomate, milho, batata palha', price: 24 },
      { name: 'X-Tudo', ingredients: 'Pão, hambúrguer 56g, frango desfiado, queijo, presunto, bacon em cubos, ovo, milho, batata palha, alface, tomate, catupiry, cheddar e abacaxi caramelizado', price: 25 },
      { name: 'Tilu Especial', ingredients: 'Pão, 3 hambúrgueres 56g, frango desfiado, queijo, presunto, bacon em cubos, ovo, milho, batata palha, alface, tomate, catupiry, cheddar', price: 26 },
    ],
  },
  {
    id: 'picanha',
    title: 'Picanha',
    note: 'Com hambúrguer de picanha de 120g.',
    orderable: true,
    items: [
      { name: 'X-Bacon Picanha', ingredients: 'Pão, hambúrguer de picanha 120g, bacon, queijo, alface, tomate, milho, batata palha', price: 23 },
      { name: 'X-Egg Bacon Picanha', ingredients: 'Pão, hambúrguer de picanha 120g, ovo, bacon, queijo, alface, tomate, milho, batata palha', price: 24 },
      { name: 'X-Egg Bacon Especial', ingredients: 'Pão, hambúrguer de picanha 120g, ovo, bacon, queijo, catupiry, alface, tomate, milho, batata palha', price: 26 },
      { name: 'X-Tudo Picanha', ingredients: 'Pão, hambúrguer de picanha 120g, frango desfiado, queijo, presunto, bacon em cubos, ovo, milho, batata palha, alface, tomate, catupiry, cheddar e abacaxi caramelizado', price: 28 },
    ],
  },
  {
    id: 'acrescimos',
    title: 'Acréscimos',
    note: 'Peça junto com o seu lanche.',
    orderable: false,
    items: [
      { name: 'Molho verde', price: 2 },
      { name: 'Baconese', price: 3 },
      { name: 'Hambúrguer 56g', price: 3 },
      { name: 'Hambúrguer de picanha 120g', price: 7 },
      { name: 'Presunto', price: 2 },
      { name: 'Queijo', price: 2 },
      { name: 'Abacaxi', price: 2 },
      { name: 'Ovo', price: 2.5 },
      { name: 'Cheddar', price: 2.5 },
      { name: 'Bacon', price: 3 },
      { name: 'Frango desfiado', price: 3 },
      { name: 'Catupiry', price: 4 },
    ],
  },
  {
    id: 'bebidas',
    title: 'Bebidas',
    note: 'Peça junto com o seu lanche.',
    orderable: false,
    items: [
      { name: 'Coca-Cola lata 310 ml, tradicional', price: 6 },
      { name: 'Coca-Cola lata 310 ml, zero', price: 6 },
      { name: 'Mate Couro 1 litro, tradicional', price: 8 },
    ],
  },
];
```

Run: `npm test`
Expected: PASS (todos).

- [ ] **Step 3: Commit**

```bash
git add src/data/menu.ts tests/menu.test.ts
git commit -m "feat: cardápio completo transcrito das imagens

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Runner de navegador, header, hero e botão flutuante

**Files:**
- Create: `scripts/smoke.mjs`, `tests/e2e/10-layout.mjs`
- Create: `src/components/Header.astro`, `src/components/Hero.astro`, `src/components/WhatsAppFab.astro`
- Modify: `src/pages/index.astro` (substituir inteiro)

**Interfaces:**
- Consumes: `business`, `waLink`, `GENERIC_ORDER_MESSAGE`, `Base`.
- Produces: runner `npm run smoke`. Cada arquivo `tests/e2e/*.mjs` exporta `default async function ({ browser, check, BASE })`, em que `check(cond: boolean, msg: string)` registra ok/FAIL. Atributos usados por testes: `[data-header]`, `[data-hero-cta]`, `[data-hero-video]`, `.fab`. A classe `show-cta` vai no header depois que o CTA do hero sai da tela.

- [ ] **Step 1: Runner**

`scripts/smoke.mjs`:
```js
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
```

- [ ] **Step 2: Escrever as checagens de layout (falham)**

`tests/e2e/10-layout.mjs`:
```js
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
  const fab = await page.getAttribute('.fab', 'href');
  check(fab === 'https://wa.me/5531984811004?text=' + encodeURIComponent('Olá! Vim pelo site e quero fazer um pedido.'), 'FAB abre o WhatsApp com a mensagem genérica');
  check(!(await page.$eval('[data-header]', (h) => h.classList.contains('show-cta'))), 'topo: botão do header escondido');
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
  await page.waitForTimeout(300);
  check(await page.$eval('[data-header]', (h) => h.classList.contains('show-cta')), 'após rolar: botão do header visível');
  await page.close();

  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const rm = await ctx.newPage();
  await rm.goto(BASE, { waitUntil: 'load' });
  await rm.waitForTimeout(500);
  check(await rm.$eval('[data-hero-video]', (v) => v.paused), 'movimento reduzido: vídeo pausado');
  const anim = await rm.$eval('h1', (el) => getComputedStyle(el).animationName);
  check(anim === 'none', `movimento reduzido: título sem animação (${anim})`);
  await ctx.close();
}
```

Run: `npm run build && npm run smoke`
Expected: FAIL (título diferente, `.fab` e `[data-header]` inexistentes).

- [ ] **Step 3: Header**

`src/components/Header.astro`:
```astro
---
import { business } from '../data/business';
import { GENERIC_ORDER_MESSAGE, waLink } from '../lib/whatsapp';
---
<header class="site-header" data-header>
  <div class="wrap bar">
    <a href="#topo" class="brand">
      <img src="/logo-tiluburguers.jpg" alt={business.name} width="44" height="44" />
    </a>
    <nav class="nav" aria-label="Seções">
      <a href="#cardapio">Cardápio</a>
      <a href="#avaliacoes">Avaliações</a>
      <a href="#onde">Onde estamos</a>
    </nav>
    <a class="btn btn-sm header-cta" href={waLink(GENERIC_ORDER_MESSAGE)} target="_blank" rel="noopener">Pedir</a>
  </div>
</header>

<script>
  const header = document.querySelector('[data-header]');
  const heroCta = document.querySelector('[data-hero-cta]');
  if (header && heroCta && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      header.classList.toggle('show-cta', !entry.isIntersecting);
    }).observe(heroCta);
  }
</script>

<style>
  .site-header {
    position: fixed; inset: 0 0 auto; z-index: 20;
    background: linear-gradient(to bottom, rgb(23 18 15 / .85), rgb(23 18 15 / 0));
    transition: background-color .2s;
  }
  .site-header.show-cta { background: var(--chapa); }
  .bar { display: flex; align-items: center; gap: 24px; min-height: 68px; }
  .brand img { border-radius: 50%; }
  .nav { display: none; gap: 24px; margin-left: auto; font: 600 1.15rem/1 var(--f-cond); }
  .nav a { color: var(--osso-suave); text-decoration: none; }
  .nav a:hover { color: var(--osso); }
  .header-cta { margin-left: auto; opacity: 0; visibility: hidden; transition: opacity .2s; }
  .site-header.show-cta .header-cta { opacity: 1; visibility: visible; }
  @media (min-width: 720px) {
    .nav { display: flex; }
    .header-cta { margin-left: 0; }
  }
</style>
```

- [ ] **Step 4: Hero**

No celular, o vídeo vertical cobre a tela com um gradiente embaixo para o texto. A partir de 1024px, o vídeo fica numa moldura em arco à direita, porque tem só 376×480 e pixelaria em tela cheia. A entrada do título ("subindo como fumaça") é a única animação automática da página.

`src/components/Hero.astro`:
```astro
---
import { business } from '../data/business';
import { GENERIC_ORDER_MESSAGE, waLink } from '../lib/whatsapp';
const { copy } = business;
---
<section class="hero" id="topo">
  <div class="wrap inner">
    <div class="copy">
      <h1 class="title">{copy.heroTitle}</h1>
      <p class="lede">{copy.heroLede}</p>
      <a class="btn" data-hero-cta href={waLink(GENERIC_ORDER_MESSAGE)} target="_blank" rel="noopener">{copy.orderCta}</a>
    </div>
    <div class="media">
      <video
        class="video"
        data-hero-video
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        poster="/video/hero-poster.jpg"
        width="376"
        height="480"
        aria-hidden="true"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>
    </div>
  </div>
</section>

<script>
  const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function apply() {
    if (!video) return;
    if (reduce.matches) {
      video.removeAttribute('autoplay');
      video.pause();
      video.currentTime = 0;
    } else {
      video.play().catch(() => {});
    }
  }
  apply();
  reduce.addEventListener('change', apply);
</script>

<style>
  .hero {
    position: relative; isolation: isolate; overflow: hidden;
    min-height: 100svh; display: flex; align-items: flex-end;
  }
  .inner { padding-block: 96px 14svh; }
  .media { position: absolute; inset: 0; z-index: -1; }
  .media::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to top, var(--chapa) 6%, rgb(23 18 15 / .72) 40%, rgb(23 18 15 / 0) 72%);
  }
  .video { width: 100%; height: 100%; object-fit: cover; }
  .title {
    font-size: clamp(2.9rem, 13vw, 6rem);
    max-width: 9ch; text-wrap: balance;
    animation: rise 1.1s cubic-bezier(.2, .7, .2, 1) .15s both;
  }
  .lede { max-width: 34ch; margin: 1rem 0 1.75rem; font-size: 1.15rem; color: var(--osso-suave); }
  @keyframes rise {
    from { opacity: 0; transform: translateY(.35em); filter: blur(8px); }
    to { opacity: 1; transform: none; filter: none; }
  }
  @media (min-width: 1024px) {
    .hero { align-items: center; }
    .inner {
      display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
      gap: 64px; align-items: center; padding-block: 120px 80px;
    }
    .media {
      position: relative; inset: auto; z-index: auto;
      aspect-ratio: 376 / 480; overflow: hidden;
      border-radius: 999px 999px 32px 32px;
      box-shadow: 0 0 0 2px var(--laranja);
    }
    .media::after { display: none; }
  }
</style>
```

- [ ] **Step 5: Botão flutuante do WhatsApp**

`src/components/WhatsAppFab.astro`:
```astro
---
import { siWhatsapp } from 'simple-icons';
import { GENERIC_ORDER_MESSAGE, waLink } from '../lib/whatsapp';
---
<a class="fab" href={waLink(GENERIC_ORDER_MESSAGE)} target="_blank" rel="noopener" aria-label="Pedir pelo WhatsApp">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={siWhatsapp.path} /></svg>
</a>

<style>
  .fab {
    position: fixed; z-index: 30;
    right: 16px; bottom: max(16px, env(safe-area-inset-bottom));
    width: 60px; height: 60px; border-radius: 50%;
    display: grid; place-items: center;
    background: var(--laranja); color: var(--chapa);
    box-shadow: 0 0 0 3px var(--chapa);
  }
  .fab:hover { background: var(--cheddar); }
  .fab svg { width: 30px; height: 30px; fill: currentColor; }
</style>
```

- [ ] **Step 6: Montar a página**

`src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import WhatsAppFab from '../components/WhatsAppFab.astro';
import { business } from '../data/business';
---
<Base title={`${business.name}, ${business.tagline.toLowerCase()} no Caiçara`}>
  <Header />
  <main>
    <Hero />
  </main>
  <WhatsAppFab />
</Base>
```

- [ ] **Step 7: Rodar as checagens**

Run: `npm run build && npm run smoke`
Expected: todas as linhas `ok`, termina com `smoke ok`. Para a checagem "após rolar" funcionar com só o hero na página, o runner rola 1,5 tela e o hero tem 100svh. Se a página for curta demais para rolar, acrescente temporariamente `<div style="height:200vh"></div>` depois de `<Hero />` e remova na Task 6.

- [ ] **Step 8: Commit**

```bash
git add scripts tests/e2e src/components src/pages
git commit -m "feat: hero com vídeo, header e botão flutuante do WhatsApp

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Barra de status

**Files:**
- Create: `src/components/StatusBar.astro`, `tests/e2e/20-status.mjs`
- Modify: `src/pages/index.astro` (importar e inserir `<StatusBar />` depois de `<Hero />`; remover o espaçador temporário, se existir)

**Interfaces:**
- Consumes: `business.hoursLabel`, `business.serviceLabel`, `openStatus`.
- Produces: `[data-status]` com `data-open="true|false"` e `[data-status-label]`.

- [ ] **Step 1: Checagens (falham)**

`tests/e2e/20-status.mjs`:
```js
export default async function ({ browser, check, BASE }) {
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  const label = (await page.textContent('[data-status-label]'))?.trim() ?? '';
  check(/^(Aberto agora, fecha à 0h|Fechado agora, abre às 19h)$/.test(label), `status ao vivo: "${label}"`);
  const open = await page.getAttribute('[data-status]', 'data-open');
  check(open === 'true' || open === 'false', `data-open definido (${open})`);
  await page.close();

  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const nojs = await ctx.newPage();
  await nojs.goto(BASE, { waitUntil: 'load' });
  check((await nojs.textContent('[data-status-label]'))?.trim() === 'Todos os dias, das 19h à 0h', 'sem JS: horário fixo');
  check((await nojs.textContent('.status'))?.includes('sem consumo no local'), 'avisa que não tem salão');
  await ctx.close();
}
```

Run: `npm run build && npm run smoke`
Expected: FAIL em `# 20-status.mjs`.

- [ ] **Step 2: Componente**

`src/components/StatusBar.astro`:
```astro
---
import { business } from '../data/business';
---
<section class="status" aria-label="Funcionamento">
  <div class="wrap row">
    <p class="state" data-status>
      <span class="dot" aria-hidden="true"></span>
      <span data-status-label>{business.hoursLabel}</span>
    </p>
    <p class="mode">{business.serviceLabel}</p>
  </div>
</section>

<script>
  import { openStatus } from '../lib/openStatus';
  const el = document.querySelector<HTMLElement>('[data-status]');
  const label = el?.querySelector('[data-status-label]');
  function update() {
    if (!el || !label) return;
    const s = openStatus(new Date());
    label.textContent = s.label;
    el.dataset.open = String(s.open);
  }
  update();
  setInterval(update, 60_000);
</script>

<style>
  .status { border-block: 1px solid rgb(255 246 234 / .12); }
  .row { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 32px; padding-block: 18px; }
  .state { display: flex; align-items: center; gap: 10px; margin: 0; font: 700 1.3rem/1.2 var(--f-cond); }
  .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--osso-suave); }
  .state[data-open='true'] .dot { background: var(--cheddar); box-shadow: 0 0 0 4px rgb(246 184 48 / .25); }
  .mode { margin: 0; color: var(--osso-suave); }
</style>
```

Em `src/pages/index.astro`, acrescente `import StatusBar from '../components/StatusBar.astro';` e `<StatusBar />` logo depois de `<Hero />`.

- [ ] **Step 3: Verificar**

Run: `npm run build && npm run smoke`
Expected: `smoke ok`.

- [ ] **Step 4: Commit**

```bash
git add src/components/StatusBar.astro src/pages/index.astro tests/e2e/20-status.mjs
git commit -m "feat: barra de status aberto/fechado ao vivo

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Cardápio em abas

**Files:**
- Create: `src/components/Menu.astro`, `src/components/MenuItem.astro`, `tests/e2e/30-menu.mjs`
- Modify: `src/pages/index.astro` (inserir `<Menu />` depois de `<StatusBar />`)

**Interfaces:**
- Consumes: `menu`, `MenuEntry`, `formatBRL`, `waLink`, `itemOrderMessage`, `business.copy.menuTitle`.
- Produces: `#cardapio`, `[data-menu]` (recebe `data-enhanced` quando o JS roda), `[data-tablist]`, abas `#tab-{id}`, painéis `#painel-{id}` com a classe `.panel`, links `a.order`.

- [ ] **Step 1: Checagens (falham)**

`tests/e2e/30-menu.mjs`:
```js
export default async function ({ browser, check, BASE }) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE, { waitUntil: 'load' });
  check((await page.locator('.panel:visible').count()) === 1, 'com JS: um painel visível');
  check(await page.locator('#painel-classicos').isVisible(), 'começa em Clássicos');

  const picanha = page.getByRole('tab', { name: 'Picanha' });
  await picanha.click();
  check(await page.locator('#painel-picanha').isVisible(), 'clique em Picanha mostra o painel');
  check((await picanha.getAttribute('aria-selected')) === 'true', 'aba Picanha marcada');
  await picanha.press('ArrowRight');
  check(await page.locator('#painel-acrescimos').isVisible(), 'seta → vai para Acréscimos');
  await page.keyboard.press('End');
  check(await page.locator('#painel-bebidas').isVisible(), 'End vai para Bebidas');
  await page.keyboard.press('ArrowRight');
  check(await page.locator('#painel-classicos').isVisible(), 'seta → no fim volta para Clássicos');

  const href = await page.locator('#painel-picanha a.order').first().getAttribute('href');
  const msg = decodeURIComponent((href ?? '').split('?text=')[1] ?? '');
  check(msg === 'Olá! Quero pedir um X-Bacon Picanha (R$ 23,00).', `link do X-Bacon Picanha: "${msg}"`);
  check((await page.locator('#painel-acrescimos a.order').count()) === 0, 'acréscimos sem botão Pedir');
  check((await page.locator('a.order').count()) === 17, '17 lanches com botão Pedir');
  await page.close();

  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const nojs = await ctx.newPage();
  await nojs.goto(BASE, { waitUntil: 'load' });
  check((await nojs.locator('.panel:visible').count()) === 4, 'sem JS: 4 categorias empilhadas');
  check(!(await nojs.locator('[data-tablist]').isVisible()), 'sem JS: abas ocultas');
  check(await nojs.getByRole('heading', { name: 'Picanha' }).isVisible(), 'sem JS: títulos das categorias visíveis');
  await ctx.close();
}
```

Run: `npm run build && npm run smoke`
Expected: FAIL em `# 30-menu.mjs`.

- [ ] **Step 2: MenuItem**

`src/components/MenuItem.astro`:
```astro
---
import type { MenuEntry } from '../data/menu';
import { formatBRL } from '../lib/format';
import { itemOrderMessage, waLink } from '../lib/whatsapp';

interface Props {
  item: MenuEntry;
  orderable: boolean;
}
const { item, orderable } = Astro.props;
---
<li class="item">
  <p class="line">
    <span class="name">{item.name}</span>
    <span class="leader" aria-hidden="true"></span>
    <span class="price">{formatBRL(item.price)}</span>
  </p>
  {item.ingredients && <p class="ingredients">{item.ingredients}</p>}
  {orderable && (
    <a
      class="order"
      href={waLink(itemOrderMessage(item.name, item.price))}
      target="_blank"
      rel="noopener"
      aria-label={`Pedir ${item.name} no WhatsApp`}
    >Pedir</a>
  )}
</li>

<style>
  .line { display: flex; align-items: baseline; gap: .4em; margin: 0; font: 700 1.4rem/1.15 var(--f-cond); }
  .name { min-width: 0; }
  .leader { flex: 1; min-width: 1.5em; border-bottom: 2px dotted currentColor; opacity: .45; transform: translateY(-.25em); }
  .price { white-space: nowrap; }
  .ingredients { margin: .3em 0 0; max-width: 60ch; color: var(--tinta-suave); font-size: .98rem; }
  .order {
    display: inline-flex; align-items: center; min-height: 44px; margin-top: .6em; padding: 0 1.1em;
    border: 2px solid var(--tinta); border-radius: 999px;
    color: var(--tinta); font: 700 1.05rem/1 var(--f-cond); text-decoration: none;
  }
  .order:hover { background: var(--laranja); border-color: var(--laranja); color: var(--chapa); }
</style>
```

- [ ] **Step 3: Menu com abas**

A borda serrilhada do papel kraft usa SVGs inline. O `fill` `%23E9DCC4` é o `--kraft` e precisa mudar se o token mudar.

`src/components/Menu.astro`:
```astro
---
import { business } from '../data/business';
import { menu } from '../data/menu';
import MenuItem from './MenuItem.astro';
---
<section class="menu" id="cardapio" aria-labelledby="cardapio-titulo" data-menu>
  <div class="wrap">
    <h2 id="cardapio-titulo">{business.copy.menuTitle}</h2>
    <div class="tabs" role="tablist" aria-label="Categorias do cardápio" data-tablist hidden>
      {menu.map((c, i) => (
        <button
          type="button"
          role="tab"
          id={`tab-${c.id}`}
          aria-controls={`painel-${c.id}`}
          aria-selected={i === 0 ? 'true' : 'false'}
          tabindex={i === 0 ? 0 : -1}
        >{c.title}</button>
      ))}
    </div>
    {menu.map((c) => (
      <div class="panel" id={`painel-${c.id}`}>
        <h3 class="panel-title">{c.title}</h3>
        <p class="note">{c.note}</p>
        <ul class="items">
          {c.items.map((item) => <MenuItem item={item} orderable={c.orderable} />)}
        </ul>
      </div>
    ))}
  </div>
</section>

<script>
  const root = document.querySelector<HTMLElement>('[data-menu]');
  const tablist = root?.querySelector<HTMLElement>('[data-tablist]');
  if (root && tablist) {
    const tabs = [...tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls') ?? '')!);

    const select = (i: number, focus = false) => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };

    panels.forEach((p, j) => {
      p.setAttribute('role', 'tabpanel');
      p.setAttribute('aria-labelledby', tabs[j].id);
      p.tabIndex = 0;
    });
    tablist.hidden = false;
    root.dataset.enhanced = '';
    select(0);

    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        const last = tabs.length - 1;
        const next =
          e.key === 'ArrowRight' ? (i === last ? 0 : i + 1)
          : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1)
          : e.key === 'Home' ? 0
          : e.key === 'End' ? last
          : -1;
        if (next >= 0) {
          e.preventDefault();
          select(next, true);
        }
      });
    });
  }
</script>

<style>
  .menu {
    position: relative; z-index: 1;
    background: var(--kraft); color: var(--tinta);
    padding-block: clamp(64px, 10vw, 112px);
  }
  .menu::before, .menu::after {
    content: ''; position: absolute; left: 0; right: 0; height: 10px;
    background-repeat: repeat-x; background-size: 16px 10px;
  }
  .menu::before {
    top: -10px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='10'%3E%3Cpath d='M0 10 8 0 16 10Z' fill='%23E9DCC4'/%3E%3C/svg%3E");
  }
  .menu::after {
    bottom: -10px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='10'%3E%3Cpath d='M0 0 8 10 16 0Z' fill='%23E9DCC4'/%3E%3C/svg%3E");
  }
  .tabs {
    display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none;
    margin: 28px 0 36px; padding: 4px;
  }
  .tabs button {
    flex: none; min-height: 44px; padding: 0 18px;
    border: 2px solid var(--tinta); border-radius: 999px;
    background: transparent; color: var(--tinta);
    font: 700 1.15rem/1 var(--f-cond); cursor: pointer;
  }
  .tabs button[aria-selected='true'] { background: var(--tinta); color: var(--kraft); }
  .panel { margin-top: 48px; }
  .menu[data-enhanced] .panel { margin-top: 0; }
  .panel-title { margin: 0 0 4px; font: 700 1.9rem/1.1 var(--f-cond); }
  .menu[data-enhanced] .panel-title {
    position: absolute; width: 1px; height: 1px; overflow: hidden;
    clip: rect(0 0 0 0); white-space: nowrap;
  }
  .note { margin: 0 0 28px; color: var(--tinta-suave); }
  .items {
    list-style: none; margin: 0; padding: 0;
    display: grid; gap: 32px 64px;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 400px), 1fr));
  }
</style>
```

Em `src/pages/index.astro`, acrescente `import Menu from '../components/Menu.astro';` e `<Menu />` depois de `<StatusBar />`.

- [ ] **Step 4: Verificar**

Run: `npm run build && npm run check && npm run smoke`
Expected: `astro check` com 0 erros; `smoke ok`, incluindo `320px: sem rolagem horizontal` agora com o cardápio na página.

- [ ] **Step 5: Commit**

```bash
git add src/components/Menu.astro src/components/MenuItem.astro src/pages/index.astro tests/e2e/30-menu.mjs
git commit -m "feat: cardápio em abas no papel kraft com pedido por item

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Avaliações

**Files:**
- Create: `src/components/Reviews.astro`, `tests/e2e/40-reviews.mjs`
- Modify: `src/pages/index.astro` (inserir `<Reviews />` depois de `<Menu />`)

**Interfaces:**
- Consumes: `business.rating`, `business.reviews`, `business.copy.reviewsTitle`.
- Produces: `#avaliacoes`, `.review` (um por avaliação), `.reply`, `.score`.

- [ ] **Step 1: Checagens (falham)**

`tests/e2e/40-reviews.mjs`:
```js
export default async function ({ browser, check, BASE }) {
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  check((await page.locator('#avaliacoes .review').count()) === 6, '6 avaliações');
  const score = (await page.textContent('#avaliacoes .score'))?.replace(/\s+/g, ' ') ?? '';
  check(score.includes('4,5') && score.includes('42 avaliações no Google'), `nota: "${score.trim()}"`);
  check((await page.locator('#avaliacoes .reply').count()) === 1, 'uma resposta do proprietário');
  check((await page.textContent('#avaliacoes'))?.includes('Melhor hambúrguer de BH'), 'texto real da Isabela');
  await page.close();
}
```

Run: `npm run build && npm run smoke`
Expected: FAIL em `# 40-reviews.mjs`.

- [ ] **Step 2: Componente**

`src/components/Reviews.astro`:
```astro
---
import { business } from '../data/business';
const { rating, reviews, copy } = business;
const ratingText = rating.value.toLocaleString('pt-BR', { minimumFractionDigits: 1 });
---
<section class="reviews" id="avaliacoes" aria-labelledby="avaliacoes-titulo">
  <div class="wrap">
    <div class="head">
      <h2 id="avaliacoes-titulo">{copy.reviewsTitle}</h2>
      <p class="score">
        <span class="num">{ratingText}</span>
        <span class="star" aria-hidden="true">★</span>
        <span class="sr-only">de 5 estrelas,</span>
        <span>{rating.count} avaliações no {rating.source}</span>
      </p>
    </div>
    <ul class="list" tabindex="0" aria-label="Avaliações de clientes">
      {reviews.map((r) => (
        <li class="review">
          <blockquote><p>“{r.text}”</p></blockquote>
          <p class="author">{r.author}</p>
          {r.ownerReply && <p class="reply">Resposta da Tilu: {r.ownerReply}</p>}
        </li>
      ))}
    </ul>
  </div>
</section>

<style>
  .reviews { padding-block: clamp(80px, 12vw, 128px) clamp(56px, 9vw, 96px); }
  .head {
    display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between;
    gap: 16px 32px; margin-bottom: 40px;
  }
  .score {
    display: flex; align-items: baseline; gap: .35em; margin: 0;
    font: 600 1.2rem/1 var(--f-cond); color: var(--osso-suave);
  }
  .num { font: 400 3.5rem/1 var(--f-display); color: var(--osso); }
  .star { color: var(--cheddar); font-size: 2rem; }
  .list {
    list-style: none; margin: 0; padding: 0 0 8px;
    display: grid; grid-auto-flow: column; grid-auto-columns: min(85%, 420px); gap: 24px;
    overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain;
  }
  .review { scroll-snap-align: start; border-top: 3px solid var(--laranja); padding-top: 20px; }
  blockquote { margin: 0; }
  blockquote p { margin: 0; font-size: 1.2rem; line-height: 1.5; }
  .author { margin: 14px 0 0; font: 600 1.15rem/1 var(--f-cond); color: var(--osso-suave); }
  .reply {
    margin: 12px 0 0; padding-left: 14px;
    border-left: 2px solid var(--osso-suave); color: var(--osso-suave); font-size: .95rem;
  }
  @media (min-width: 960px) {
    .list { grid-auto-flow: row; grid-template-columns: repeat(3, 1fr); gap: 48px 40px; overflow: visible; }
  }
</style>
```

Em `src/pages/index.astro`, acrescente `import Reviews from '../components/Reviews.astro';` e `<Reviews />` depois de `<Menu />`.

- [ ] **Step 3: Verificar**

Run: `npm run build && npm run smoke`
Expected: `smoke ok`.

- [ ] **Step 4: Commit**

```bash
git add src/components/Reviews.astro src/pages/index.astro tests/e2e/40-reviews.mjs
git commit -m "feat: seção de avaliações reais do Google

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Localização e rodapé

**Files:**
- Create: `src/components/Location.astro`, `src/components/Footer.astro`, `tests/e2e/50-location.mjs`
- Modify: `src/pages/index.astro` (inserir `<Location />` depois de `<Reviews />` dentro de `<main>` e `<Footer />` depois de `</main>`)

**Interfaces:**
- Consumes: `business`, `mapsEmbedUrl`, `mapsLinkUrl`, `waLink`, `GENERIC_ORDER_MESSAGE`, `siInstagram`.
- Produces: `#onde`, `.map iframe`, `footer .credit a`.

- [ ] **Step 1: Checagens (falham)**

`tests/e2e/50-location.mjs`:
```js
export default async function ({ browser, check, BASE }) {
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  const src = (await page.getAttribute('#onde iframe', 'src')) ?? '';
  check(src.startsWith('https://www.google.com/maps?q=') && src.endsWith('&output=embed'), 'mapa incorporado');
  check((await page.getAttribute('#onde iframe', 'loading')) === 'lazy', 'mapa com carregamento tardio');
  check((await page.textContent('#onde address'))?.includes('Rua Cananéia, 97'), 'endereço em texto');
  check((await page.getAttribute('#onde a[href*="maps/search"]', 'target')) === '_blank', 'link Abrir no Google Maps');
  check((await page.getAttribute('#onde a[href="https://www.instagram.com/tiluburguers"]', 'rel')) === 'noopener', 'link do Instagram');
  const credit = page.locator('footer .credit a');
  check((await credit.getAttribute('href')) === 'https://jhonlinesolutions.com.br', 'crédito aponta para JH Online Solutions');
  check((await credit.textContent())?.trim() === 'Feito com fome por JH Online Solutions', 'texto do crédito');
  await page.close();
}
```

Run: `npm run build && npm run smoke`
Expected: FAIL em `# 50-location.mjs`.

- [ ] **Step 2: Location**

`src/components/Location.astro`:
```astro
---
import { siInstagram } from 'simple-icons';
import { business } from '../data/business';
import { mapsEmbedUrl, mapsLinkUrl } from '../lib/maps';
import { GENERIC_ORDER_MESSAGE, waLink } from '../lib/whatsapp';
const { address: a, copy } = business;
---
<section class="location" id="onde" aria-labelledby="onde-titulo">
  <div class="wrap grid">
    <div class="info">
      <h2 id="onde-titulo">{copy.locationTitle}</h2>
      <address>
        {a.street}<br />
        {a.district}, {a.city}/{a.state}<br />
        CEP {a.zip}
      </address>
      <p class="hours">{business.hoursLabel}</p>
      <p class="mode">{business.serviceLabel}</p>
      <p class="links">
        <a href={mapsLinkUrl()} target="_blank" rel="noopener">Abrir no Google Maps</a>
        <a href={business.instagram} target="_blank" rel="noopener" class="ig">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={siInstagram.path} /></svg>
          {business.instagramHandle}
        </a>
      </p>
      <a class="btn" href={waLink(GENERIC_ORDER_MESSAGE)} target="_blank" rel="noopener">{copy.orderCta}</a>
    </div>
    <div class="map">
      <iframe
        src={mapsEmbedUrl()}
        title={`Mapa: ${a.street}, ${a.district}, ${a.city}`}
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</section>

<style>
  .location { padding-block: clamp(56px, 9vw, 96px); border-top: 1px solid rgb(255 246 234 / .12); }
  .grid { display: grid; gap: 40px; }
  address { margin: 20px 0 16px; font: 600 1.45rem/1.3 var(--f-cond); font-style: normal; }
  .hours { margin: 0; font-weight: 500; }
  .mode { margin: 4px 0 20px; color: var(--osso-suave); }
  .links { display: flex; flex-wrap: wrap; gap: 12px 24px; margin: 0 0 28px; }
  .links a { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; }
  .ig svg { width: 20px; height: 20px; fill: currentColor; }
  .map iframe { width: 100%; aspect-ratio: 4 / 3; border: 0; border-radius: 20px; background: var(--tinta); }
  @media (min-width: 900px) {
    .grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr); align-items: center; gap: 64px; }
  }
</style>
```

- [ ] **Step 3: Footer**

`src/components/Footer.astro`:
```astro
---
import { business } from '../data/business';
const year = new Date().getFullYear();
---
<footer class="footer">
  <div class="wrap row">
    <img src="/logo-tiluburguers.jpg" alt="" width="56" height="56" loading="lazy" />
    <p>© {year} {business.name}. {business.tagline}.</p>
    <p class="credit">
      <a href={business.credit.url} target="_blank" rel="noopener">{business.credit.label}</a>
    </p>
  </div>
</footer>

<style>
  .footer { border-top: 1px solid rgb(255 246 234 / .12); padding: 40px 0 112px; color: var(--osso-suave); font-size: .95rem; }
  .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 24px; }
  .row img { border-radius: 50%; }
  .row p { margin: 0; }
  .credit { margin-left: auto !important; }
  .credit a:hover { color: var(--osso); }
</style>
```

Em `src/pages/index.astro`, importe `Location` e `Footer`; `<Location />` entra depois de `<Reviews />` e `<Footer />` logo depois de `</main>`.

- [ ] **Step 4: Verificar**

Run: `npm run build && npm run check && npm test && npm run smoke`
Expected: tudo verde; `smoke ok`.

- [ ] **Step 5: Commit**

```bash
git add src/components/Location.astro src/components/Footer.astro src/pages/index.astro tests/e2e/50-location.mjs
git commit -m "feat: localização com mapa, Instagram e rodapé com crédito

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Revisão visual por capturas de tela

**Files:**
- Create: `tests/e2e/90-screenshots.mjs`
- Modify: qualquer componente com problema visual encontrado (só CSS e marcação; nada de conteúdo novo)

**Interfaces:**
- Consumes: a página completa.
- Produces: `screenshots/*.png` (ignorados pelo git).

- [ ] **Step 1: Gerador de capturas**

`tests/e2e/90-screenshots.mjs`:
```js
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
```

Run: `npm run build && npm run smoke`
Expected: `smoke ok`; 9 PNGs em `screenshots/`.

- [ ] **Step 2: Revisar as capturas contra a spec**

Abra cada PNG com a ferramenta de leitura de imagens e confira:
- Hero no celular: título legível sobre o vídeo, CTA acima da dobra, sem texto encostado na borda.
- Hero no desktop: moldura em arco à direita, sem pixelização visível, título alinhado à esquerda.
- Cardápio: preços alinhados pelos pontilhados, nomes longos quebrando sem empurrar o preço para fora, borda serrilhada do kraft visível em cima e embaixo.
- Avaliações: rolagem lateral no celular, 3 colunas no desktop.
- Nenhum elemento coberto pelo botão flutuante no fim da página (o rodapé tem 112px de respiro).
- Nada de caixa alta decorativa, cards com sombra ou "→" em botões.

Anote cada problema encontrado e corrija no componente correspondente.

- [ ] **Step 3: Rodar tudo de novo**

Run: `npm test && npm run build && npm run check && npm run smoke`
Expected: tudo verde.

- [ ] **Step 4: Commit (se houve ajustes)**

```bash
git add src tests/e2e/90-screenshots.mjs
git commit -m "style: ajustes da revisão visual e gerador de capturas

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Publicação (GitHub + Vercel + DNS)

**Files:** nenhum no código.

Estes passos dependem de contas do Jomar. O executor para e pede cada ação manual, sem improvisar credenciais.

- [ ] **Step 1: Pedir ao Jomar que crie o repositório vazio**

Mensagem ao Jomar: "Crie em github.com/new um repositório **vazio** chamado `tiluburguers` (sem README, sem .gitignore) e me mande a URL."

- [ ] **Step 2: Enviar o código**

```bash
git remote add origin <URL_DO_REPOSITORIO>
git push -u origin main
```
Expected: push concluído; `git status` mostra `Your branch is up to date with 'origin/main'`.

- [ ] **Step 3: Vercel e domínio (Jomar, pela web)**

Instruções ao Jomar:
1. Em vercel.com/new, importe `tiluburguers`. O preset **Astro** é detectado; não mude nada e clique em Deploy.
2. Em Project → Settings → Domains, adicione `tiluburguers.jhonlinesolutions.com.br`.
3. No DNS do `jhonlinesolutions.com.br`, crie `CNAME` com nome `tiluburguers` e valor `cname.vercel-dns.com`.

- [ ] **Step 4: Verificar no ar**

Depois que o Jomar confirmar que o domínio ficou verde na Vercel:
```bash
curl -sI https://tiluburguers.jhonlinesolutions.com.br | head -1
```
Expected: `HTTP/2 200`.
