import highwaysJson from '@/../data/highways.json';
import type { Highway, HighwayType } from '../types';

const highways: Highway[] = highwaysJson as Highway[];

export function getAllHighways(): Highway[] {
  return highways;
}

export function getHighwayBySlug(slug: string): Highway | undefined {
  return highways.find(h => h.slug === slug);
}

export function getHighwaysByType(type: HighwayType): Highway[] {
  return highways.filter(h => h.highwayType === type);
}

export function getHighwaysGroupedByType(): { type: HighwayType; highways: Highway[] }[] {
  const typeOrder: HighwayType[] = ['간선고속도로', '순환고속도로', '지선고속도로', '기타고속도로'];
  return typeOrder
    .map(type => ({
      type,
      highways: highways.filter(h => h.highwayType === type),
    }))
    .filter(group => group.highways.length > 0);
}
