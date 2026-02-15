import { getAllRestAreas } from './rest-areas';
import type { RestArea } from '../types';

const REGION_MAP: Record<string, string> = {
  '경기': '경기도', '경기도': '경기도',
  '강원': '강원도', '강원도': '강원도', '강원특별자치도': '강원도',
  '충북': '충청북도', '충청북도': '충청북도',
  '충남': '충청남도', '충청남도': '충청남도',
  '전북': '전라북도', '전라북도': '전라북도', '전북특별자치도': '전라북도',
  '전남': '전라남도', '전라남도': '전라남도',
  '경북': '경상북도', '경상북도': '경상북도',
  '경남': '경상남도', '경상남도': '경상남도',
  '서울': '서울특별시', '서울특별시': '서울특별시',
  '대구': '대구광역시', '대구광역시': '대구광역시',
  '대전': '대전광역시', '대전시': '대전광역시',
  '울산': '울산광역시', '울산광역시': '울산광역시',
  '세종': '세종특별자치시', '세종특별자치시': '세종특별자치시',
  '부산': '부산광역시', '부산광역시': '부산광역시',
};

const REGION_META: Record<string, { slug: string; shortName: string }> = {
  '경기도': { slug: 'gyeonggi', shortName: '경기' },
  '강원도': { slug: 'gangwon', shortName: '강원' },
  '충청북도': { slug: 'chungbuk', shortName: '충북' },
  '충청남도': { slug: 'chungnam', shortName: '충남' },
  '전라북도': { slug: 'jeonbuk', shortName: '전북' },
  '전라남도': { slug: 'jeonnam', shortName: '전남' },
  '경상북도': { slug: 'gyeongbuk', shortName: '경북' },
  '경상남도': { slug: 'gyeongnam', shortName: '경남' },
  '서울특별시': { slug: 'seoul', shortName: '서울' },
  '대구광역시': { slug: 'daegu', shortName: '대구' },
  '대전광역시': { slug: 'daejeon', shortName: '대전' },
  '울산광역시': { slug: 'ulsan', shortName: '울산' },
  '세종특별자치시': { slug: 'sejong', shortName: '세종' },
  '부산광역시': { slug: 'busan', shortName: '부산' },
};

export function extractRegion(address: string): string | null {
  if (!address) return null;
  const first = address.split(' ')[0];
  return REGION_MAP[first] ?? null;
}

export function getAllRegions(): { name: string; slug: string; shortName: string; count: number }[] {
  const restAreas = getAllRestAreas();
  const countMap = new Map<string, number>();

  for (const area of restAreas) {
    const region = extractRegion(area.address);
    if (region) {
      countMap.set(region, (countMap.get(region) ?? 0) + 1);
    }
  }

  return Object.entries(REGION_META)
    .filter(([name]) => (countMap.get(name) ?? 0) > 0)
    .map(([name, meta]) => ({
      name,
      slug: meta.slug,
      shortName: meta.shortName,
      count: countMap.get(name) ?? 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getRegionBySlug(slug: string): { name: string; slug: string; shortName: string } | undefined {
  for (const [name, meta] of Object.entries(REGION_META)) {
    if (meta.slug === slug) {
      return { name, slug: meta.slug, shortName: meta.shortName };
    }
  }
  return undefined;
}

export function getRestAreasByRegion(regionSlug: string): RestArea[] {
  const region = getRegionBySlug(regionSlug);
  if (!region) return [];

  return getAllRestAreas().filter(area => extractRegion(area.address) === region.name);
}
