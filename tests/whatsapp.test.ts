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
