export function formatBRL(n: number): string {
  return `R$ ${n.toFixed(2).replace('.', ',')}`;
}
