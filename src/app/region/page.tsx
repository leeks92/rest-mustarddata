import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllRegions } from '@/lib/data/regions';

export const metadata: Metadata = {
  title: '지역별 고속도로 휴게소 - 시·도별 휴게소 맛집·편의시설',
  description: '경기도, 충청도, 경상도, 전라도, 강원도 등 시·도별 고속도로 휴게소 정보. 지역별 추천 맛집과 편의시설을 확인하세요.',
  alternates: {
    canonical: 'https://rest.mustarddata.com/region',
  },
};

export default function RegionListPage() {
  const regions = getAllRegions();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">지역별 고속도로 휴게소</h1>
      <p className="text-gray-600 mb-8">전국 {regions.length}개 시·도의 고속도로 휴게소 정보를 확인하세요.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {regions.map(region => (
          <Link
            key={region.slug}
            href={`/region/${region.slug}`}
            className="block p-6 bg-white border border-gray-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all text-center"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">{region.shortName}</h2>
            <p className="text-sm text-gray-500 mb-3">{region.name}</p>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
              {region.count}개 휴게소
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
