import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllRestAreas } from '@/lib/data';

export const metadata: Metadata = {
  title: '고속도로 휴게소 맛집 추천 - 전국 대표 음식 총정리',
  description: '전국 고속도로 휴게소 대표 맛집 메뉴를 총정리! 돈가스, 국밥, 비빔밥, 호두과자 등 한국도로공사 선정 맛집과 인기 메뉴를 확인하세요.',
};

export default function FoodPage() {
  const allAreas = getAllRestAreas().filter(a => a.bestFood && a.bestFood.trim() !== '');

  // 카테고리별 분류
  const categories: { label: string; emoji: string; keywords: string[] }[] = [
    { label: '돈가스', emoji: '🥩', keywords: ['돈가스', '돈까스', '돈갓스', '커틀릿'] },
    { label: '국밥·탕', emoji: '🍲', keywords: ['국밥', '탕', '해장국', '설렁탕', '순두부'] },
    { label: '비빔밥', emoji: '🍚', keywords: ['비빔밥', '밥정식'] },
    { label: '면류', emoji: '🍜', keywords: ['국수', '칼국수', '짬뽕', '우동', '라멘'] },
    { label: '간식', emoji: '🧁', keywords: ['호두과자', '강정', '고로케', '떡'] },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">🍽️ 고속도로 휴게소 맛집 추천</h1>
      <p className="text-gray-600 mb-8">
        전국 고속도로 휴게소의 대표 음식 {allAreas.length}개를 확인하세요.
      </p>

      {/* 카테고리별 */}
      {categories.map(cat => {
        const matched = allAreas.filter(a =>
          cat.keywords.some(k => a.bestFood.toLowerCase().includes(k))
        );
        if (matched.length === 0) return null;

        return (
          <section key={cat.label} className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {cat.emoji} {cat.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matched.map(area => (
                <Link
                  key={area.slug}
                  href={`/rest-area/${area.slug}`}
                  className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all"
                >
                  <h3 className="font-bold text-gray-900 mb-1">{area.name}휴게소</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {area.highway} · {area.direction}방향
                  </p>
                  <p className="text-orange-700 font-medium">{area.bestFood}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* 기타 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 text-gray-900">🌟 기타 추천 메뉴</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allAreas
            .filter(a => !categories.some(cat =>
              cat.keywords.some(k => a.bestFood.toLowerCase().includes(k))
            ))
            .map(area => (
              <Link
                key={area.slug}
                href={`/rest-area/${area.slug}`}
                className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-gray-900 mb-1">{area.name}휴게소</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {area.highway} · {area.direction}방향
                </p>
                <p className="text-orange-700 font-medium">{area.bestFood}</p>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
