import restAreasJson from '@/../data/rest-areas.json';
import highwaysJson from '@/../data/highways.json';
import metadataJson from '@/../data/metadata.json';
import type { RestArea, Highway, Metadata } from './types';

const restAreas: RestArea[] = restAreasJson as RestArea[];
const highways: Highway[] = highwaysJson as Highway[];
const metadata: Metadata = metadataJson as Metadata;

// ===== 휴게소 =====

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

// ===== 고속도로 =====

export function getAllHighways(): Highway[] {
  return highways;
}

export function getHighwayBySlug(slug: string): Highway | undefined {
  return highways.find(h => h.slug === slug);
}

// ===== 메타데이터 =====

export function getMetadata(): Metadata {
  return metadata;
}

// ===== 인기 휴게소 (맛집 기준) =====

export function getPopularRestAreas(limit: number = 12): RestArea[] {
  return restAreas
    .filter(r => r.bestFood && r.bestFood.trim() !== '')
    .slice(0, limit);
}

// ===== 편의시설 필터 =====

export function getRestAreasWithEvCharger(): RestArea[] {
  return restAreas.filter(r => r.hasEvCharger);
}

export function getRestAreasWithGasStation(): RestArea[] {
  return restAreas.filter(r => r.hasGasStation);
}

export function getRestAreasWithShower(): RestArea[] {
  return restAreas.filter(r => r.hasShower);
}
