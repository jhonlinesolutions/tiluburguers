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
