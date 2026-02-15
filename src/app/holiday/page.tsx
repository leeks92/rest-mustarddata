import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllRestAreas, getRestAreasByHighway } from '@/lib/data/rest-areas';
import { getAllHighways } from '@/lib/data/highways';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: '명절 연휴 고속도로 휴게소 완벽 가이드 - 설날·추석 추천 맛집·편의시설',
  description:
    '설날·추석 명절 연휴 고속도로 여행 가이드. 노선별 추천 휴게소, 명절 인기 맛집(호두과자·돈가스·국밥), 가족 편의시설(수유실·샤워실·전기차충전) 정보.',
};

// 명절 주요 4대 노선
const MAIN_ROUTES = [
  { slug: 'gyeongbu', label: '경부선', desc: '서울 ↔ 부산' },
  { slug: 'seohaean', label: '서해안선', desc: '서울 ↔ 목포' },
  { slug: 'yeongdong', label: '영동선', desc: '인천 ↔ 강릉' },
  { slug: 'honam', label: '호남선', desc: '논산 ↔ 순천' },
];

// 명절 인기 음식 카테고리
const HOLIDAY_FOOD_CATEGORIES = [
  { label: '호두과자·간식', emoji: '🥜', keywords: ['호두과자', '강정', '고로케', '떡'] },
  { label: '돈가스', emoji: '🥩', keywords: ['돈가스', '돈까스', '돈갓스', '커틀릿'] },
  { label: '국밥·탕', emoji: '🍲', keywords: ['국밥', '탕', '해장국', '설렁탕', '순두부'] },
  { label: '면류', emoji: '🍜', keywords: ['국수', '칼국수', '짬뽕', '우동', '라멘'] },
];

// FAQ 데이터
const FAQ_ITEMS = [
  {
    q: '명절 연휴 휴게소 영업시간은?',
    a: '대부분의 고속도로 휴게소는 명절 연휴에도 24시간 정상 운영됩니다. 다만 일부 브랜드 매장이나 간이휴게소는 운영시간이 변경될 수 있으니 방문 전 확인을 권장합니다.',
  },
  {
    q: '가장 혼잡한 시간대와 피하는 방법은?',
    a: '명절 당일 오전 7~11시가 가장 혼잡합니다. 새벽 4~5시 출발 또는 오후 6시 이후 출발을 권장합니다. 경부·서해안선 주요 휴게소는 식사 시간대(11~13시)에 특히 붐비니 미리 간식을 준비하거나 비교적 한산한 소규모 휴게소를 이용하세요.',
  },
  {
    q: '전기차 충전은 어디서 할 수 있나요?',
    a: '대부분의 일반휴게소에 전기차 급속충전기가 설치되어 있습니다. 명절에는 충전 대기 시간이 길어질 수 있으므로 출발 전 완충을 권장합니다. 아래 편의시설 섹션에서 전기차 충전 가능 휴게소 목록을 확인하세요.',
  },
  {
    q: '가족과 함께 갈 만한 휴게소는?',
    a: '수유실, 샤워실 등 편의시설이 갖춰진 대형 휴게소를 추천합니다. 행담도, 덕평, 안성, 서울만남의광장 등은 다양한 편의시설과 맛집이 있어 가족 여행객에게 인기가 많습니다.',
  },
];

export default function HolidayPage() {
  const allAreas = getAllRestAreas();
  const highways = getAllHighways();

  // 주요 노선별 추천 휴게소 (bestFood가 있는 상위 3개)
  const routeRecommendations = MAIN_ROUTES.map(route => {
    const hw = highways.find(h => h.slug === route.slug);
    const areas = allAreas
      .filter(a => a.highwaySlug === route.slug && a.bestFood && a.bestFood.trim() !== '')
      .slice(0, 3);
    return { ...route, highway: hw, areas };
  });

  // 명절 인기 음식별 휴게소
  const foodSections = HOLIDAY_FOOD_CATEGORIES.map(cat => {
    const matched = allAreas
      .filter(
        a =>
          a.bestFood &&
          cat.keywords.some(k => a.bestFood.toLowerCase().includes(k))
      )
      .slice(0, 6);
    return { ...cat, areas: matched };
  });

  // 편의시설별 휴게소
  const nursingRoomAreas = allAreas.filter(a => a.hasNursingRoom).slice(0, 8);
  const showerAreas = allAreas.filter(a => a.hasShower).slice(0, 8);
  const evChargerAreas = allAreas.filter(a => a.hasEvCharger).slice(0, 8);

  // JSON-LD
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '명절 연휴 고속도로 휴게소 완벽 가이드',
    description:
      '설날·추석 명절 연휴 고속도로 여행 가이드. 노선별 추천 휴게소, 인기 맛집, 편의시설 정보.',
    url: 'https://rest.mustarddata.com/holiday',
  };

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={collectionJsonLd} />

      {/* Hero 섹션 */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            명절 연휴 고속도로 휴게소 완벽 가이드
          </h1>
          <p className="text-lg md:text-xl text-red-100 mb-4">
            설날·추석 여행의 모든 정보 — 추천 맛집, 편의시설, 여행 꿀팁
          </p>
          <p className="text-red-200 text-sm">
            전국 {allAreas.length}개 휴게소 데이터 기반
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 명절 여행 꿀팁 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            🚗 명절 여행 꿀팁
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-gray-200 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">⏰ 출발 시간대 가이드</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-red-700">추천:</strong> 새벽 4~5시 출발 또는 오후 6시 이후 출발<br />
                <strong className="text-red-700">피하세요:</strong> 오전 7~11시 (가장 혼잡한 시간대)
              </p>
            </div>
            <div className="p-5 bg-white border border-gray-200 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">🚧 혼잡 구간 안내</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                경부선(서울~천안), 서해안선(서울~서산), 영동선(여주~원주) 구간이 명절 연휴 가장 혼잡합니다.
                우회 노선이나 대체 경로를 미리 확인하세요.
              </p>
            </div>
            <div className="p-5 bg-white border border-gray-200 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">🎒 준비물 체크리스트</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                비상약, 충전케이블, 담요, 간식·음료, 여벌 옷, 현금(일부 매장용).
                어린이 동반 시 장난감·태블릿도 챙기세요.
              </p>
            </div>
            <div className="p-5 bg-white border border-gray-200 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">💤 안전 운전 수칙</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-red-700">2시간마다 휴식</strong>을 권장합니다.
                졸음운전 예방을 위해 휴게소에서 10~15분 쉬어가세요. 동승자와 운전을 교대하면 더 안전합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 주요 노선별 추천 휴게소 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            🛣️ 주요 노선별 추천 휴게소
          </h2>
          {routeRecommendations.map(route => (
            <div key={route.slug} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-bold text-gray-900">{route.label}</h3>
                <span className="text-sm text-gray-500">{route.desc}</span>
                <Link
                  href={`/highway/${route.slug}`}
                  className="text-sm text-red-600 hover:underline ml-auto"
                >
                  전체 보기 →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {route.areas.map(area => (
                  <Link
                    key={area.slug}
                    href={`/rest-area/${area.slug}`}
                    className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-red-400 hover:shadow-md transition-all"
                  >
                    <h4 className="font-bold text-gray-900 mb-1">{area.name}휴게소</h4>
                    <p className="text-sm text-gray-500 mb-2">
                      {area.highway} · {area.direction}방향
                    </p>
                    <p className="text-red-700 font-medium">{area.bestFood}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* 명절 인기 음식 TOP */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            🍽️ 명절 인기 음식 TOP
          </h2>
          {foodSections.map(cat => {
            if (cat.areas.length === 0) return null;
            return (
              <div key={cat.label} className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-gray-900">
                  {cat.emoji} {cat.label}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.areas.map(area => (
                    <Link
                      key={area.slug}
                      href={`/rest-area/${area.slug}`}
                      className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-red-400 hover:shadow-md transition-all"
                    >
                      <h4 className="font-bold text-gray-900 mb-1">{area.name}휴게소</h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {area.highway} · {area.direction}방향
                      </p>
                      <p className="text-orange-700 font-medium">{area.bestFood}</p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* 가족 여행 편의시설 가이드 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            👨‍👩‍👧‍👦 가족 여행 편의시설 가이드
          </h2>

          {/* 수유실 */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-900">🍼 수유실 있는 휴게소</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {nursingRoomAreas.map(area => (
                <Link
                  key={area.slug}
                  href={`/rest-area/${area.slug}`}
                  className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-red-400 hover:shadow-md transition-all"
                >
                  <h4 className="font-bold text-gray-900 text-sm">{area.name}휴게소</h4>
                  <p className="text-xs text-gray-500">{area.highway} · {area.direction}방향</p>
                </Link>
              ))}
            </div>
          </div>

          {/* 샤워실 */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-900">🚿 샤워실 있는 휴게소</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {showerAreas.map(area => (
                <Link
                  key={area.slug}
                  href={`/rest-area/${area.slug}`}
                  className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-red-400 hover:shadow-md transition-all"
                >
                  <h4 className="font-bold text-gray-900 text-sm">{area.name}휴게소</h4>
                  <p className="text-xs text-gray-500">{area.highway} · {area.direction}방향</p>
                </Link>
              ))}
            </div>
          </div>

          {/* 전기차 충전 */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-900">⚡ 전기차 충전 가능 휴게소</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {evChargerAreas.map(area => (
                <Link
                  key={area.slug}
                  href={`/rest-area/${area.slug}`}
                  className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-red-400 hover:shadow-md transition-all"
                >
                  <h4 className="font-bold text-gray-900 text-sm">{area.name}휴게소</h4>
                  <p className="text-xs text-gray-500">{area.highway} · {area.direction}방향</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 명절 FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            ❓ 명절 자주 묻는 질문
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <details
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-5 group"
                open={i === 0}
              >
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-gray-700 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
