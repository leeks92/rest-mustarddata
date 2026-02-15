import Link from 'next/link';
import { getAllHighways } from '@/lib/data/highways';
import { getMetadata } from '@/lib/data/metadata';
import { getPopularRestAreas } from '@/lib/data/popular';
import { getAllRegions } from '@/lib/data/regions';
import { getSearchableRestAreas } from '@/lib/data/search';
import SearchForm from '@/components/SearchForm';
import JsonLd from '@/components/JsonLd';

export default function HomePage() {
  const highways = getAllHighways();
  const metadata = getMetadata();
  const popularAreas = getPopularRestAreas(12);
  const regions = getAllRegions();

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '전국 고속도로 휴게소 정보',
    url: 'https://rest.mustarddata.com',
    description: '전국 고속도로 휴게소 맛집, 편의시설, 대표 메뉴 정보',
    publisher: {
      '@type': 'Organization',
      name: 'MustardData',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '고속도로 휴게소에서 가장 인기 있는 음식은?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '한국도로공사 선정 기준으로, 호두과자, 돈가스(망향등심돈가스, 사과수제돈가스 등), 국밥(횡성한우국밥, 대구따로국밥 등), 우동이 전국 휴게소에서 가장 많이 팔리는 메뉴입니다.',
        },
      },
      {
        '@type': 'Question',
        name: '전기차 충전이 가능한 휴게소는 어디인가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '대부분의 고속도로 휴게소에 전기차 급속충전기가 설치되어 있습니다. 행담도, 덕평, 서울만남의광장 등 주요 휴게소에서 충전이 가능합니다.',
        },
      },
      {
        '@type': 'Question',
        name: '고속도로 휴게소 영업시간은?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '대부분의 고속도로 휴게소는 24시간 운영됩니다. 다만 일부 간이휴게소나 매장은 운영시간이 다를 수 있으니 방문 전 확인이 필요합니다.',
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={faqJsonLd} />

      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            전국 고속도로 휴게소 정보
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 mb-8">
            {metadata.highwayCount}개 고속도로, {metadata.restAreaCount}개 휴게소의 맛집·편의시설 정보를 한눈에
          </p>
          <SearchForm restAreas={getSearchableRestAreas()} />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 고속도로 노선별 바로가기 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            🛣️ 고속도로 노선별 휴게소
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {highways.map(hw => (
              <Link
                key={hw.slug}
                href={`/highway/${hw.slug}`}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all"
              >
                <div>
                  <span className="font-medium text-gray-900">{hw.name}</span>
                  <span className="block text-sm text-gray-500">{hw.restAreas.length}개 휴게소</span>
                </div>
                <span className="text-emerald-500">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 지역별 휴게소 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              📍 지역별 휴게소
            </h2>
            <Link href="/region" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              전체보기 →
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {regions.map(region => (
              <Link
                key={region.slug}
                href={`/region/${region.slug}`}
                className="flex flex-col items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all"
              >
                <span className="font-bold text-gray-900">{region.shortName}</span>
                <span className="text-xs text-gray-500 mt-1">{region.count}개</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 인기 휴게소 맛집 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            🍽️ 휴게소 대표 맛집 메뉴
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularAreas.map(area => (
              <Link
                key={area.slug}
                href={`/rest-area/${area.slug}`}
                className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{area.name}휴게소</h3>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full shrink-0">
                    {area.highway}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {area.direction}방향 · {area.address}
                </p>
                {area.bestFood && (
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">🍽️</span>
                    <span className="font-medium text-orange-700">{area.bestFood}</span>
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {area.hasEvCharger && (
                    <span className="badge-facility badge-yes">⚡ 전기차충전</span>
                  )}
                  {area.hasGasStation && (
                    <span className="badge-facility badge-yes">⛽ 주유소</span>
                  )}
                  {area.hasShower && (
                    <span className="badge-facility badge-yes">🚿 샤워실</span>
                  )}
                  {area.hasNursingRoom && (
                    <span className="badge-facility badge-yes">🍼 수유실</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ 섹션 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            ❓ 자주 묻는 질문
          </h2>
          <div className="space-y-4">
            <details className="bg-white border border-gray-200 rounded-xl p-5 group" open>
              <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                고속도로 휴게소에서 가장 인기 있는 음식은?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                한국도로공사 선정 기준으로, 호두과자, 돈가스(망향등심돈가스, 사과수제돈가스 등), 국밥(횡성한우국밥, 대구따로국밥 등), 우동이 전국 휴게소에서 가장 많이 팔리는 메뉴입니다. 명절 연휴 기간에는 호두과자가 매출 1위를 차지하며, 설 연휴 기준 약 18억 원의 매출을 기록하기도 합니다.
              </p>
            </details>
            <details className="bg-white border border-gray-200 rounded-xl p-5 group">
              <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                전기차 충전이 가능한 휴게소는 어디인가요?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                대부분의 고속도로 휴게소에 전기차 급속충전기가 설치되어 있습니다. 행담도, 덕평, 서울만남의광장 등 주요 휴게소에서 충전이 가능합니다. 충전기 설치 여부는 각 휴게소 상세 페이지에서 확인할 수 있습니다.
              </p>
            </details>
            <details className="bg-white border border-gray-200 rounded-xl p-5 group">
              <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                고속도로 휴게소 영업시간은?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                대부분의 고속도로 휴게소는 24시간 운영됩니다. 다만 일부 간이휴게소나 브랜드 매장(스타벅스, 편의점 등)은 별도 운영시간이 있을 수 있으니 방문 전 확인이 필요합니다.
              </p>
            </details>
          </div>
        </section>

        {/* 데이터 출처 */}
        <section className="text-center text-sm text-gray-500">
          <p>
            데이터 출처: 한국도로공사 공공데이터 (data.ex.co.kr) · 공공데이터포털 (data.go.kr)
          </p>
          <p className="mt-1">
            최종 업데이트: {new Date(metadata.lastUpdated).toLocaleDateString('ko-KR')}
          </p>
        </section>
      </div>
    </>
  );
}
