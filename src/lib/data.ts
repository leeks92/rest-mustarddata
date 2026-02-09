import restAreasJson from '@/../data/rest-areas.json';
import highwaysJson from '@/../data/highways.json';
import metadataJson from '@/../data/metadata.json';
import type { RestArea, Highway, Metadata, HighwayType } from './types';

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

// ===== 고속도로 유형별 조회 =====

export function getHighwaysByType(type: HighwayType): Highway[] {
  return highways.filter(h => h.highwayType === type);
}

/** 유형별로 그룹핑된 고속도로 목록 반환 (표시 순서 보장) */
export function getHighwaysGroupedByType(): { type: HighwayType; highways: Highway[] }[] {
  const typeOrder: HighwayType[] = ['간선고속도로', '순환고속도로', '지선고속도로', '기타고속도로'];
  return typeOrder
    .map(type => ({
      type,
      highways: highways.filter(h => h.highwayType === type),
    }))
    .filter(group => group.highways.length > 0);
}

/** 유형별로 그룹핑된 전체 휴게소 목록 반환 */
export function getRestAreasGroupedByHighwayType(): {
  type: HighwayType;
  highways: { highway: Highway; restAreas: RestArea[] }[];
}[] {
  const typeOrder: HighwayType[] = ['간선고속도로', '순환고속도로', '지선고속도로', '기타고속도로'];
  return typeOrder
    .map(type => {
      const hwsOfType = highways.filter(h => h.highwayType === type);
      return {
        type,
        highways: hwsOfType.map(hw => ({
          highway: hw,
          restAreas: restAreas.filter(r => r.highwaySlug === hw.slug),
        })),
      };
    })
    .filter(group => group.highways.length > 0);
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
