import { MetadataRoute } from 'next';
import { getAllRestAreas, getAllHighways } from '@/lib/data';

export const dynamic = 'force-static';

const BASE_URL = 'https://rest.mustarddata.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const restAreas = getAllRestAreas();
  const highways = getAllHighways();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/highway`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/rest-area`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/food`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  const highwayPages: MetadataRoute.Sitemap = highways.map(hw => ({
    url: `${BASE_URL}/highway/${hw.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const restAreaPages: MetadataRoute.Sitemap = restAreas.map(area => ({
    url: `${BASE_URL}/rest-area/${area.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...highwayPages, ...restAreaPages];
}
