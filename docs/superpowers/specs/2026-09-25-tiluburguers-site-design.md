# Tilu Burguers: site protótipo (design)

**Data:** 2026-09-25
**Status:** aprovado em conversa, aguardando revisão da spec escrita

## 1. Objetivo e contexto

Site de uma página para a **Tiluburguer's, "O Hambúrguer Raiz"**, hamburgueria de bairro no Caiçara, em Belo Horizonte. O site é um **protótipo de venda**: Jomar (Jhonline Solutions) vai apresentá-lo à dona do negócio para fechar o contrato. O atendimento por IA no WhatsApp é oferecido à parte, na reunião, e **não aparece no site**.

**Critérios de sucesso**
- No celular, o site impressiona nos primeiros segundos (hero com o vídeo) e passa a sensação de marca premium sem perder o lado "raiz".
- Qualquer visitante encontra em menos de 10 segundos o cardápio com os preços, se a loja está aberta agora e como pedir pelo WhatsApp.
- Carregamento rápido no 4G e deploy em `tiluburguers.jhonlinesolutions.com.br`.
- Fácil de evoluir depois do fechamento (carrinho etc.) sem reescrever nada.

**Fora do escopo (v1)**
- SEO: sem meta description, Open Graph, schema.org ou sitemap. Ficam apenas `<title>`, favicon e `lang="pt-BR"`.
- Carrinho e pedido estruturado, backend, analytics, painel administrativo, menção à IA.

## 2. Dados do negócio

| Campo | Valor |
|---|---|
| Nome exibido | Tiluburguer's |
| Slogan | O Hambúrguer Raiz |
| Endereço | Rua Cananéia, 97, Caiçara, Belo Horizonte/MG, CEP 30770-120 |
| WhatsApp | +55 31 98481-1004 → `5531984811004` |
| Instagram | https://www.instagram.com/tiluburguers |
| Horário | Todos os dias, das 19h às 0h (fuso `America/Sao_Paulo`) |
| Atendimento | **Delivery e retirada, sem salão** |
| Nota Google | 4,5 ★, 42 avaliações (fonte: Restaurant Guru; **Jomar confere no perfil antes da apresentação**) |

### Avaliações (reais, do Google, coladas por Jomar)

Nome exibido = primeiro nome + inicial do sobrenome. Textos cortados pelo Google terminam em "…". Nada é completado.

1. **Isabela**, 6 meses: "Melhor hambúrguer de BH, o hambúrguer mais recheado que já comi aqui, vale demais!"
   *Resposta do proprietário:* "Obrigado Isabela"
2. **Gabrielle L.**, 8 meses: "Tinha muito tempo que não comia um sanduíche raiz tão saboroso. Fomos achando que era um lugar para comer no local, mas o estabelecimento é para retirada. Aliás, não posso deixar de comentar que o cheiro na porta estava uma delícia, um dos…"
3. **Eder J.**, 5 meses: "Sempre peço lá, atendimento ótimo e o hambúrguer é delicioso. Só insumo de qualidade. Podem pedir sem medo, se tiver alguém reclamando é porque comeu errado. Nota 10"
4. **Fernando T.**, 9 meses: "Hambúrguer simplesmente delicioso! Quase passei direto, pois não sabia que era só delivery e uma moça muito atenciosa saiu da casa e fiz o pedido com ela. Eu estava com um pouco de pressa e eles providenciaram com agilidade meu lanche."
5. **Rosimar O.**, 2 meses: "Melhor hambúrguer que já comi em minha vida."
6. **Derly D.**, 2 meses: "Adorei o sanduíche, muito bem feito e muito gostoso. Parabéns"

Os tempos relativos ("6 meses") não aparecem no site, porque envelhecem mal.

### Cardápio (transcrito de `img/cardapio01.jpg` e `img/cardapio02.jpg`)

**Clássicos (hambúrguer 56g)**
| Item | Ingredientes | R$ |
|---|---|---|
| X-Burguer | Pão, hambúrguer 56g, queijo, presunto, alface, tomate, milho, batata palha | 17,00 |
| X-Egg | Pão, hambúrguer 56g, ovo, queijo, alface, tomate, milho, batata palha | 17,00 |
| X-Bacon | Pão, hambúrguer 56g, queijo, bacon, alface, tomate, milho, batata palha | 18,00 |
| X-Lucheddar | Pão, hambúrguer 56g, queijo, bacon, cheddar, alface, tomate, milho, batata palha | 19,00 |
| X-Egg Bacon | Pão, hambúrguer 56g, queijo, bacon, ovo, alface, tomate, milho, batata palha | 19,00 |
| X-Lulu | Pão, 2 hambúrgueres 56g, frango desfiado, catupiry, queijo, presunto, alface, tomate, milho, batata palha | 20,00 |
| X-Tilulu | Pão, hambúrguer 56g, frango desfiado, queijo, catupiry, bacon, alface, tomate, milho e batata palha | 22,00 |
| Laçador | Pão, hambúrguer 56g, frango desfiado, catupiry, queijo, presunto, bacon, ovo, alface, tomate, milho, batata palha | 22,00 |
| X-Americano | Pão, hambúrguer 56g, queijo, presunto, bacon, ovo, cheddar, alface, tomate, milho, batata palha | 22,00 |
| X-Galinha | Pão, frango desfiado, catupiry, queijo, presunto, bacon, ovo, alface, tomate, milho, batata palha | 23,00 |
| Americano Especial | Pão, 2 hambúrgueres 56g, frango desfiado, catupiry, queijo, presunto, bacon, alface, tomate, milho, batata palha | 24,00 |
| X-Tudo | Pão, hambúrguer 56g, frango desfiado, queijo, presunto, bacon em cubos, ovo, milho, batata palha, alface, tomate, catupiry, cheddar e abacaxi caramelizado | 25,00 |
| Tilu Especial | Pão, 3 hambúrgueres 56g, frango desfiado, queijo, presunto, bacon em cubos, ovo, milho, batata palha, alface, tomate, catupiry, cheddar | 26,00 |

**Picanha (hambúrguer de picanha 120g)**
| Item | Ingredientes | R$ |
|---|---|---|
| X-Bacon Picanha | Pão, hambúrguer de picanha 120g, bacon, queijo, alface, tomate, milho, batata palha | 23,00 |
| X-Egg Bacon Picanha | Pão, hambúrguer de picanha 120g, ovo, bacon, queijo, alface, tomate, milho, batata palha | 24,00 |
| X-Egg Bacon Especial | Pão, hambúrguer de picanha 120g, ovo, bacon, queijo, catupiry, alface, tomate, milho, batata palha | 26,00 |
| X-Tudo Picanha | Pão, hambúrguer de picanha 120g, frango desfiado, queijo, presunto, bacon em cubos, ovo, milho, batata palha, alface, tomate, catupiry, cheddar e abacaxi caramelizado | 28,00 |

No cardápio impresso, os itens da linha picanha se chamam só "X-Bacon", "X-Tudo" etc. No site, o sufixo "Picanha" desfaz a ambiguidade, tanto na tela quanto na mensagem do WhatsApp.

**Acréscimos:** Molho verde 2,00 · Baconese 3,00 · Hambúrguer 56g 3,00 · Hambúrguer de picanha 120g 7,00 · Presunto 2,00 · Queijo 2,00 · Abacaxi 2,00 · Ovo 2,50 · Cheddar 2,50 · Bacon 3,00 · Frango desfiado 3,00 · Catupiry 4,00

**Bebidas:** Coca-Cola lata 310 ml, tradicional 6,00 · Coca-Cola lata 310 ml, zero 6,00 · Mate Couro 1 litro, tradicional 8,00

Acréscimos e bebidas não têm botão "Pedir" individual. Esses itens são pedidos junto com o lanche.

## 3. Direção visual: "Chapa e papel de embrulho"

O "hambúrguer raiz" é tratado como lanchonete de bairro feita com capricho, não como hamburgueria gourmet genérica. O escuro vem da chapa quente e da fumaça do vídeo. O cardápio é uma folha de papel kraft de embrulho, com preços alinhados por pontilhados, no estilo dos cardápios de balcão.

**Paleta (tokens CSS)**
| Token | Hex | Uso |
|---|---|---|
| `--chapa` | `#17120F` | fundo principal (ferro grelhado, marrom-carvão) |
| `--laranja` | `#F28C1B` | cor da marca: CTAs, destaques. **Confirmar medindo o logo** |
| `--cheddar` | `#F6B830` | status "aberto agora", estrelas |
| `--kraft` | `#E9DCC4` | fundo da seção de cardápio |
| `--osso` | `#FFF6EA` | texto sobre o escuro |
| `--tinta` | `#2A211B` | texto sobre o kraft |

Contraste mínimo AA em todos os pares de texto. O texto em laranja sobre kraft **não** é usado para corpo de texto (contraste baixo): no kraft, o laranja aparece só em fundos de botão com texto `--chapa`.

**Tipografia** (servida pelo próprio site via `@fontsource`)
- **Titan One**: títulos. Letra gorda e arredondada que conversa com o lettering do logo.
- **Barlow Condensed** (600/700): nomes de lanches, preços e rótulos de abas. Cara de placa de lanchonete.
- **Barlow** (400/500): corpo de texto e ingredientes.
- Frases em caixa normal, sem etiquetas em caixa alta, sem uma palavra destacada no meio do título.

**Princípios**
- **A ousadia fica em um lugar só:** o vídeo com a fumaça subindo por trás do título. Na carga, acontece **um único** movimento: o título surge enquanto o vídeo começa. As outras seções entram sem animação.
- Sem cards com sombra, gradientes decorativos, numeração 01/02/03 ou "→" em botões.
- Com `prefers-reduced-motion`, fica o poster parado e sem animação de título.
- Foco de teclado sempre visível (contorno `--cheddar`).

## 4. Estrutura da página

```
┌──────────────────────────────┐
│ [logo]            [Pedir]    │  header fixo e compacto; o botão só aparece após rolar
│   VÍDEO fumaça (tela cheia)  │  celular: vídeo cobre 100svh com gradiente inferior
│  O hambúrguer raiz           │  desktop (≥1024px): título à esquerda,
│  do Caiçara.                 │  vídeo numa moldura alta arredondada à direita
│  [Pedir no WhatsApp]         │  (o vídeo tem 376×480 e pixelaria em tela cheia)
├──────────────────────────────┤
│ ● Aberto agora, fecha à 0h   │  StatusBar
│ Delivery e retirada no Caiçara│
├──────────── kraft ───────────┤
│ [Clássicos][Picanha][Acrésc.][Bebidas]
│ X-Bacon ............ R$ 18,00│
│ Pão, hambúrguer 56g, queijo… │
│                     [Pedir]  │
├──────────────────────────────┤
│ 4,5 ★  42 avaliações no Google│  Reviews: citações grandes, rolagem lateral
│ "Melhor hambúrguer de BH…"   │  com scroll-snap no celular, grade no desktop
│   └ resposta do proprietário │
├──────────────────────────────┤
│ Mapa  │ Rua Cananéia, 97     │  Location: iframe Maps + endereço + horário
│       │ Todo dia 19h–0h      │  + link "Ver no Instagram"
├──────────────────────────────┤
│ Rodapé: logo, © 2026, "Feito com fome por JH Online Solutions"
└──────────────────────────────┘
                    [● WhatsApp]  FAB fixo no canto inferior direito
```

**Textos principais (pt-BR)**
- Título do hero: "O hambúrguer raiz do Caiçara."
- Subtítulo: "Feito na chapa, bem recheado. Delivery e retirada todos os dias, das 19h à meia-noite."
- CTA principal: "Pedir no WhatsApp"
- Status: "Aberto agora, fecha à 0h" ou "Fechado agora, abre às 19h"
- Rodapé: "Feito com fome por JH Online Solutions", com link para https://jhonlinesolutions.com.br (`target="_blank" rel="noopener"`)

## 5. Arquitetura técnica

**Stack:** Astro (saída estática), CSS próprio com tokens em `:root` (sem Tailwind, para manter o controle fino do visual), TypeScript, Vitest.

```
/ (raiz do repositório = pasta tilufood)
├─ img/                      originais (mantidos como fonte)
├─ public/
│  ├─ video/hero.mp4         cópia de img/animation.mp4
│  ├─ video/hero-poster.jpg  1º frame extraído do vídeo
│  ├─ logo-tiluburguers.jpg
│  └─ favicon.png            gerado a partir do logo
├─ src/
│  ├─ data/menu.ts           categorias → itens {nome, ingredientes, preco}
│  ├─ data/business.ts       contato, endereço, horário, nota, avaliações
│  ├─ lib/whatsapp.ts        waLink(msg?: string): string
│  ├─ lib/openStatus.ts      openStatus(now: Date): {open: boolean, label: string}
│  ├─ lib/format.ts          formatBRL(n: number): "R$ 18,00"
│  ├─ components/            Header, Hero, StatusBar, Menu, MenuItem,
│  │                         Reviews, Location, Footer, WhatsAppFab (.astro)
│  ├─ styles/global.css      tokens, reset, tipografia
│  ├─ layouts/Base.astro
│  └─ pages/index.astro
└─ tests/                    whatsapp.test.ts, openStatus.test.ts, format.test.ts
```

**Contratos**
- `waLink()` retorna `https://wa.me/5531984811004`. `waLink(msg)` acrescenta `?text=` com `encodeURIComponent(msg)`.
  - Mensagem genérica: "Olá! Vim pelo site e quero fazer um pedido."
  - Por item: `Olá! Quero pedir um ${nome} (${formatBRL(preco)}).`
- `openStatus(now)` converte `now` para `America/Sao_Paulo` via `Intl.DateTimeFormat`. Aberto quando `19 ≤ hora < 24`.
  - Rótulos: aberto → "Aberto agora, fecha à 0h"; fechado → "Fechado agora, abre às 19h".
  - O horário fica em `business.ts`, e a função lê de lá.
- Os componentes não têm texto de conteúdo embutido. Tudo vem de `data/`.

**Comportamento no navegador (JS mínimo, sem framework)**
- **StatusBar:** o HTML estático traz "Todos os dias, das 19h à 0h". Um script inline troca pelo status ao vivo e o recalcula a cada minuto.
- **Abas do cardápio:** `role="tablist"`/`tab`/`tabpanel`, com setas ←/→, Home e End. Sem JS, todas as categorias aparecem empilhadas com seus títulos, porque o estado inicial das abas é aplicado pelo script.
- **Vídeo:** `autoplay muted loop playsinline preload="metadata" poster=…`. Com `prefers-reduced-motion: reduce`, o script remove o autoplay e pausa o vídeo, deixando o poster.
- **Header:** o botão "Pedir" aparece quando o CTA do hero sai da tela (IntersectionObserver).
- **Mapa:** `<iframe loading="lazy">` com `https://www.google.com/maps?q=Rua+Cananéia,+97,+Belo+Horizonte&output=embed`.
- Todos os links do WhatsApp e do Instagram usam `target="_blank" rel="noopener"`.

**Tratamento de falhas**
- Se o vídeo falhar ou demorar, o poster fica visível e o título continua legível (gradiente garante o contraste).
- Se o iframe do mapa for bloqueado, o endereço em texto e o link "Abrir no Google Maps" continuam lá.
- Sem JS, a página continua completa: status fixo, todas as categorias visíveis, links do WhatsApp funcionando.

## 6. Testes e verificação

- **Vitest (TDD nas funções puras):**
  - `openStatus`: 18:59 fechado; 19:00 aberto; 23:59 aberto; 00:00 fechado; 03:00 fechado.
  - `openStatus` com entrada em UTC: `2026-09-25T22:30Z` (19:30 em BH) aberto; `2026-09-26T03:10Z` (00:10 em BH) fechado.
  - `waLink`: sem mensagem; com acentos e parênteses codificados; número correto.
  - `formatBRL`: 18 vira "R$ 18,00"; 2.5 vira "R$ 2,50".
  - Integridade dos dados: todo item tem nome, ingredientes e preço > 0; os nomes são únicos no cardápio inteiro.
- `astro check` e `astro build` sem erros nem avisos.
- Capturas de tela em 390×844 e 1440×900 para revisão visual (Playwright), mais uma checagem de contraste nos pares de cor.

## 7. Deploy

1. `git init` na raiz, `.gitignore` do Astro, commits pequenos.
2. Repositório GitHub `tiluburguers`. Como `gh` não está instalado, Jomar cria o repositório pela web e eu faço o `git remote add` e o `push`. Se ele preferir, instalo o `gh`.
3. Vercel: importar o repositório pela web (preset Astro detectado automaticamente, sem variáveis de ambiente).
4. Domínio: adicionar `tiluburguers.jhonlinesolutions.com.br` no projeto Vercel. No DNS: `CNAME tiluburguers → cname.vercel-dns.com`.

## 8. Pendências antes da apresentação (Jomar)

- Conferir no perfil do Google a nota exata e o total de avaliações.
- Confirmar se o horário 19h–0h vale para todos os dias.
