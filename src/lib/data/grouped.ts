import restAreasJson from '@/../data/rest-areas.json';
import highwaysJson from '@/../data/highways.json';
import type { RestArea, Highway, HighwayType } from '../types';

const restAreas: RestArea[] = restAreasJson as RestArea[];
const highways: Highway[] = highwaysJson as Highway[];

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
