import restAreasJson from '@/../data/rest-areas.json';
import type { RestArea } from '../types';

const restAreas: RestArea[] = restAreasJson as RestArea[];

export function getAllRestAreas(): RestArea[] {
  return restAreas;
}

export function getRestAreaBySlug(slug: string): RestArea | undefined {
  return restAreas.find(r => r.slug === slug);
}

export function getRestAreasByHighway(highwaySlug: string): RestArea[] {
  return restAreas.filter(r => r.highwaySlug === highwaySlug);
}

export function searchRestAreas(query: string): RestArea[] {
  const q = query.toLowerCase();
  return restAreas.filter(
    r =>
      r.name.toLowerCase().includes(q) ||
      r.highway.toLowerCase().includes(q) ||
      r.bestFood.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q)
  );
}

export function getRestAreasWithEvCharger(): RestArea[] {
  return restAreas.filter(r => r.hasEvCharger);
}

export function getRestAreasWithGasStation(): RestArea[] {
  return restAreas.filter(r => r.hasGasStation);
}

export function getRestAreasWithShower(): RestArea[] {
  return restAreas.filter(r => r.hasShower);
}
