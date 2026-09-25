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
