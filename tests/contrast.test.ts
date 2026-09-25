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
