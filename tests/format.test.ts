import { describe, expect, it } from 'vitest';
import { formatBRL } from '../src/lib/format';

describe('formatBRL', () => {
  it('inteiro', () => expect(formatBRL(18)).toBe('R$ 18,00'));
  it('com centavos', () => expect(formatBRL(2.5)).toBe('R$ 2,50'));
  it('usa espaço comum', () => expect(formatBRL(6)).not.toContain(' '));
});
