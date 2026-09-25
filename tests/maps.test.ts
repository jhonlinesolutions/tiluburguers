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
