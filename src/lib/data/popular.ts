import popularRestAreasJson from '@/../data/popular-rest-areas.json';
import type { PopularRestArea } from '../types';

const popularRestAreas: PopularRestArea[] = popularRestAreasJson as PopularRestArea[];

export function getPopularRestAreas(limit: number = 12): PopularRestArea[] {
  return popularRestAreas.slice(0, limit);
}
