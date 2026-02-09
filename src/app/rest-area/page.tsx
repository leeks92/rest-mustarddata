import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllRestAreas, getRestAreasGroupedByHighwayType } from '@/lib/data';
import { HIGHWAY_TYPE_META } from '@/lib/types';

export const metadata: Metadata = {
  title: '전국 고속도로 휴게소 전체 목록 - 노선 유형별 정리',
  description: '전국 고속도로 휴게소를 간선·순환·지선 등 노선 유형별로 분류하여 확인하세요. 휴게소별 대표 음식, 편의시설, 위치 정보를 제공합니다.',
};

export default function RestAreaListPage() {
  const allRestAreas = getAllRestAreas();
  const grouped = getRestAreasGroupedByHighwayType();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">전국 휴게소 목록</h1>
      <p className="text-gray-600 mb-6">전국 {allRestAreas.length}개 고속도로 휴게소를 노선 유형별로 확인하세요</p>

      {/* 유형별 바로가기 */}
      <nav className="flex flex-wrap gap-2 mb-8">
        {grouped.map(group => (
          <a
            key={group.type}
            href={`#${group.type}`}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
          >
            {HIGHWAY_TYPE_META[group.type].label}
            <span className="ml-1 text-emerald-500">
              ({group.highways.reduce((sum, h) => sum + h.restAreas.length, 0)})
            </span>
          </a>
        ))}
      </nav>

      {/* 유형별 그룹 */}
      {grouped.map(group => (
        <section key={group.type} id={group.type} className="mb-12 scroll-mt-20">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{HIGHWAY_TYPE_META[group.type].label}</h2>
            <p className="text-sm text-gray-500 mt-1">{HIGHWAY_TYPE_META[group.type].desc}</p>
          </div>

          {group.highways.map(({ highway, restAreas }) => (
            <div key={highway.slug} className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Link
                  href={`/highway/${highway.slug}`}
                  className="text-lg font-semibold text-gray-800 hover:text-emerald-700 transition-colors"
                >
                  {highway.name}
                </Link>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {restAreas.length}개 휴게소
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">휴게소명</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">방향</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">대표 음식</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">주요 시설</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restAreas.map(area => (
                      <tr key={area.slug} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Link href={`/rest-area/${area.slug}`} className="font-medium text-emerald-700 hover:underline">
                            {area.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{area.direction || '-'}</td>
                        <td className="px-4 py-3 text-sm text-orange-700 font-medium">{area.bestFood || '-'}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-1">
                            {area.hasGasStation && <span title="주유소">⛽</span>}
                            {area.hasEvCharger && <span title="전기차충전">⚡</span>}
                            {area.hasShower && <span title="샤워실">🚿</span>}
                            {area.hasNursingRoom && <span title="수유실">🍼</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
