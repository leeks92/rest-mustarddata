import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllRestAreas } from '@/lib/data';

export const metadata: Metadata = {
  title: '전국 고속도로 휴게소 전체 목록',
  description: '전국 고속도로 휴게소를 한눈에 확인하세요. 휴게소별 대표 음식, 편의시설, 위치 정보를 제공합니다.',
};

export default function RestAreaListPage() {
  const restAreas = getAllRestAreas();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">전국 휴게소 목록</h1>
      <p className="text-gray-600 mb-8">전국 {restAreas.length}개 고속도로 휴게소</p>

      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">휴게소명</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">고속도로</th>
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
                <td className="px-4 py-3 text-sm text-gray-600">{area.highway}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{area.direction}</td>
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
  );
}
