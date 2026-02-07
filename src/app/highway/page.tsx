import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllHighways } from '@/lib/data';

export const metadata: Metadata = {
  title: '고속도로 노선별 휴게소 목록',
  description: '경부·서해안·영동·호남 등 전국 고속도로 노선별 휴게소를 확인하세요. 각 노선의 휴게소 위치, 대표 음식, 편의시설 정보를 제공합니다.',
};

export default function HighwayListPage() {
  const highways = getAllHighways();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">고속도로 노선별 휴게소</h1>
      <p className="text-gray-600 mb-8">전국 {highways.length}개 고속도로 노선의 휴게소 정보를 확인하세요.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {highways.map(hw => (
          <Link
            key={hw.slug}
            href={`/highway/${hw.slug}`}
            className="block p-6 bg-white border border-gray-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-900">{hw.name}</h2>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                {hw.restAreas.length}개 휴게소
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {hw.restAreas.slice(0, 5).map(ra => (
                <span key={ra.slug} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {ra.name}
                </span>
              ))}
              {hw.restAreas.length > 5 && (
                <span className="text-xs text-gray-400">+{hw.restAreas.length - 5}개</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
