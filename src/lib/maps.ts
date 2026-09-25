import { business } from '../data/business';

export function mapsQuery(): string {
  const a = business.address;
  return `${a.street}, ${a.district}, ${a.city} - ${a.state}, ${a.zip}`;
}

export function mapsEmbedUrl(): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery())}&output=embed`;
}

export function mapsLinkUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery())}`;
}
