import searchRestAreasJson from '@/../data/search-rest-areas.json';
import type { SearchRestArea } from '../types';

const searchRestAreas: SearchRestArea[] = searchRestAreasJson as SearchRestArea[];

export function getSearchableRestAreas(): SearchRestArea[] {
  return searchRestAreas;
}
