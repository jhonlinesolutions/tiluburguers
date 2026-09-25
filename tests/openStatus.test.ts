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
