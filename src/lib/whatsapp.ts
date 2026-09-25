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
