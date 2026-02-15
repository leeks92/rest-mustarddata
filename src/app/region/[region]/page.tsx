import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllRegions, getRegionBySlug, getRestAreasByRegion } from '@/lib/data/regions';
import JsonLd from '@/components/JsonLd';

interface Props {
  params: Promise<{ region: string }>;
}

export async function generateStaticParams() {
  return getAllRegions().map(r => ({ region: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region: slug } = await params;
  const region = getRegionBySlug(slug);
  if (!region) return { title: '지역을 찾을 수 없습니다' };

  const restAreas = getRestAreasByRegion(slug);

  return {
    title: `${region.name} 고속도로 휴게소 목록 - 맛집, 편의시설 정보`,
    description: `${region.name}의 고속도로 휴게소 ${restAreas.length}개를 확인하세요. ${region.shortName} 지역 휴게소 대표 음식, 편의시설, 브랜드 매장 정보를 제공합니다.`,
    alternates: {
      canonical: `https://rest.mustarddata.com/region/${slug}`,
    },
  };
}

export default async function RegionPage({ params }: Props) {
  const { region: slug } = await params;
  const region = getRegionBySlug(slug);
  if (!region) notFound();

  const restAreas = getRestAreasByRegion(slug);

  // 고속도로별 그룹핑
  const highwayGroups = new Map<string, typeof restAreas>();
  for (const area of restAreas) {
    const hw = area.highway;
    if (!highwayGroups.has(hw)) highwayGroups.set(hw, []);
    highwayGroups.get(hw)!.push(area);
  }

  // 편의시설 통계
  const stats = {
    evCharger: restAreas.filter(r => r.hasEvCharger).length,
    nursingRoom: restAreas.filter(r => r.hasNursingRoom).length,
    shower: restAreas.filter(r => r.hasShower).length,
    gasStation: restAreas.filter(r => r.hasGasStation).length,
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${region.name} 고속도로 휴게소 목록`,
    numberOfItems: restAreas.length,
    itemListElement: restAreas.map((area, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${area.name}휴게소`,
      url: `https://rest.mustarddata.com/rest-area/${area.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 브레드크럼 */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-emerald-600">홈</Link>
          <span className="mx-2">›</span>
          <Link href="/region" className="hover:text-emerald-600">지역별 휴게소</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{region.name}</span>
        </nav>

        <h1 className="text-3xl font-bold mb-2 text-gray-900">{region.name} 고속도로 휴게소</h1>
        <p className="text-gray-600 mb-8">총 {restAreas.length}개 휴게소 · {highwayGroups.size}개 노선</p>

        {/* 편의시설 요약 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <span className="text-2xl">⚡</span>
            <p className="text-lg font-bold text-gray-900 mt-1">{stats.evCharger}개</p>
            <p className="text-xs text-gray-500">전기차 충전</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <span className="text-2xl">⛽</span>
            <p className="text-lg font-bold text-gray-900 mt-1">{stats.gasStation}개</p>
            <p className="text-xs text-gray-500">주유소</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <span className="text-2xl">🍼</span>
            <p className="text-lg font-bold text-gray-900 mt-1">{stats.nursingRoom}개</p>
            <p className="text-xs text-gray-500">수유실</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <span className="text-2xl">🚿</span>
            <p className="text-lg font-bold text-gray-900 mt-1">{stats.shower}개</p>
            <p className="text-xs text-gray-500">샤워실</p>
          </div>
        </div>

        {/* 고속도로별 그룹 */}
        {Array.from(highwayGroups.entries()).map(([highway, areas]) => (
          <section key={highway} className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              {highway}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {areas.map(area => (
                <Link
                  key={area.slug}
                  href={`/rest-area/${area.slug}`}
                  className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all"
                >
                  <h3 className="font-bold text-gray-900 mb-1">{area.name}휴게소</h3>
                  <p className="text-xs text-gray-500 mb-2">{area.direction}방향</p>
                  {area.bestFood && (
                    <p className="text-sm mb-3">
                      <span className="text-orange-500">🍽️</span>{' '}
                      <span className="text-orange-700 font-medium">{area.bestFood}</span>
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {area.hasEvCharger && <span className="badge-facility badge-yes">⚡ 전기차충전</span>}
                    {area.hasGasStation && <span className="badge-facility badge-yes">⛽ 주유소</span>}
                    {area.hasShower && <span className="badge-facility badge-yes">🚿 샤워실</span>}
                    {area.hasNursingRoom && <span className="badge-facility badge-yes">🍼 수유실</span>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
