import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getHighwayBySlug, getRestAreasByHighway, getAllHighways } from '@/lib/data';
import JsonLd from '@/components/JsonLd';

interface Props {
  params: Promise<{ highway: string }>;
}

export async function generateStaticParams() {
  const highways = getAllHighways();
  return highways.map(hw => ({
    highway: hw.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { highway: slug } = await params;
  const hw = getHighwayBySlug(decodeURIComponent(slug));
  if (!hw) return { title: '고속도로를 찾을 수 없습니다' };

  return {
    title: `${hw.name} 휴게소 목록 - 맛집, 편의시설 정보`,
    description: `${hw.name}의 휴게소 ${hw.restAreas.length}개를 확인하세요. 각 휴게소의 대표 음식, 편의시설, 브랜드 매장 정보를 제공합니다.`,
    alternates: {
      canonical: `https://rest.mustarddata.com/highway/${slug}`,
    },
  };
}

export default async function HighwayPage({ params }: Props) {
  const { highway: slug } = await params;
  const hw = getHighwayBySlug(decodeURIComponent(slug));
  if (!hw) notFound();

  const restAreas = getRestAreasByHighway(decodeURIComponent(slug));

  // 방향별 그룹핑
  const directionGroups = new Map<string, typeof restAreas>();
  for (const area of restAreas) {
    const dir = area.direction || '양방향';
    if (!directionGroups.has(dir)) directionGroups.set(dir, []);
    directionGroups.get(dir)!.push(area);
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${hw.name} 휴게소 목록`,
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
          <Link href="/highway" className="hover:text-emerald-600">고속도로</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{hw.name}</span>
        </nav>

        <h1 className="text-3xl font-bold mb-2 text-gray-900">{hw.name} 휴게소</h1>
        <p className="text-gray-600 mb-8">총 {restAreas.length}개 휴게소</p>

        {Array.from(directionGroups.entries()).map(([direction, areas]) => (
          <section key={direction} className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              {direction}방향
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {areas.map(area => (
                <Link
                  key={area.slug}
                  href={`/rest-area/${area.slug}`}
                  className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all"
                >
                  <h3 className="font-bold text-gray-900 mb-2">{area.name}휴게소</h3>
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
                    {area.hasPharmacy && <span className="badge-facility badge-yes">💊 약국</span>}
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
