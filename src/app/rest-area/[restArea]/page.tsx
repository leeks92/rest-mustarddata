import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRestAreaBySlug, getAllRestAreas, getRestAreasByHighway } from '@/lib/data/rest-areas';
import JsonLd from '@/components/JsonLd';

interface Props {
  params: Promise<{ restArea: string }>;
}

export async function generateStaticParams() {
  const areas = getAllRestAreas();
  return areas.map(a => ({
    restArea: a.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { restArea: slug } = await params;
  const area = getRestAreaBySlug(decodeURIComponent(slug));
  if (!area) return { title: '휴게소를 찾을 수 없습니다' };

  const foodDesc = area.bestFood ? ` 대표 음식: ${area.bestFood}.` : '';
  const facilityList = area.facilities.map(f => f.name).join(', ');

  return {
    title: `${area.name}휴게소 (${area.highway} ${area.direction}방향) - 메뉴·편의시설·브랜드`,
    description: `${area.name}휴게소 정보. ${area.highway} ${area.direction}방향.${foodDesc} 메뉴 ${area.foods.length}개. 편의시설: ${facilityList || '정보 없음'}. 브랜드: ${area.brands.map(b => b.name).join(', ') || '없음'}.`,
    alternates: {
      canonical: `https://rest.mustarddata.com/rest-area/${slug}`,
    },
  };
}

function formatPrice(price: number): string {
  return price > 0 ? `${price.toLocaleString()}원` : '';
}

export default async function RestAreaDetailPage({ params }: Props) {
  const { restArea: slug } = await params;
  const area = getRestAreaBySlug(decodeURIComponent(slug));
  if (!area) notFound();

  const sameHighway = getRestAreasByHighway(area.highwaySlug)
    .filter(a => a.slug !== area.slug)
    .slice(0, 6);

  // 대표/추천 메뉴와 일반 메뉴 분리
  const bestFoods = area.foods.filter(f => f.isBest || f.isRecommend);
  const regularFoods = area.foods.filter(f => !f.isBest && !f.isRecommend);

  const placeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${area.name}휴게소`,
    description: `${area.highway} ${area.direction}방향 휴게소. ${area.bestFood ? `대표 음식: ${area.bestFood}` : ''}`,
    address: area.address,
    telephone: area.tel || undefined,
    geo: area.lat && area.lng ? {
      '@type': 'GeoCoordinates',
      latitude: area.lat,
      longitude: area.lng,
    } : undefined,
    openingHours: area.openTime && area.closeTime ? `Mo-Su ${area.openTime}-${area.closeTime}` : 'Mo-Su 00:00-24:00',
  };

  return (
    <>
      <JsonLd data={placeJsonLd} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 브레드크럼 */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-emerald-600">홈</Link>
          <span className="mx-2">›</span>
          <Link href={`/highway/${area.highwaySlug}`} className="hover:text-emerald-600">{area.highway}</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{area.name}휴게소</span>
        </nav>

        {/* 헤더 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {area.name}휴게소
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                  {area.highway}
                </span>
                {area.direction && (
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {area.direction}방향
                  </span>
                )}
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  {area.type}
                </span>
              </div>
              {area.address && <p className="text-gray-600">{area.address}</p>}
              {area.tel && (
                <p className="text-gray-600 mt-1">📞 {area.tel}</p>
              )}
            </div>
            {area.bestFood && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 md:min-w-[200px]">
                <p className="text-sm text-orange-600 mb-1">🍽️ 대표 음식</p>
                <p className="text-lg font-bold text-orange-800">{area.bestFood}</p>
              </div>
            )}
          </div>
        </div>

        {/* 기본 정보 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">기본 정보</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700 w-32">운영시간</td>
                  <td className="px-4 py-3 text-gray-900">
                    {area.openTime === '00:00' && area.closeTime === '24:00'
                      ? '24시간 운영'
                      : `${area.openTime} ~ ${area.closeTime}`}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">노선</td>
                  <td className="px-4 py-3 text-gray-900">
                    <Link href={`/highway/${area.highwaySlug}`} className="text-emerald-600 hover:underline">
                      {area.highway}
                    </Link>
                    {area.direction && ` ${area.direction}방향`}
                  </td>
                </tr>
                {area.address && (
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">소재지</td>
                    <td className="px-4 py-3 text-gray-900">{area.address}</td>
                  </tr>
                )}
                {area.tel && (
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">전화번호</td>
                    <td className="px-4 py-3 text-gray-900">{area.tel}</td>
                  </tr>
                )}
                <tr>
                  <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">좌표</td>
                  <td className="px-4 py-3 text-gray-900 text-sm text-gray-500">
                    위도 {area.lat}, 경도 {area.lng}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 메뉴 - 대표/추천 */}
        {bestFoods.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900">⭐ 대표·추천 메뉴</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bestFoods.map((food, i) => (
                <div key={i} className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{food.name}</h3>
                    <div className="flex gap-1">
                      {food.isBest && (
                        <span className="text-xs bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full">대표</span>
                      )}
                      {food.isRecommend && (
                        <span className="text-xs bg-yellow-200 text-yellow-700 px-2 py-0.5 rounded-full">추천</span>
                      )}
                    </div>
                  </div>
                  {food.price > 0 && (
                    <p className="text-lg font-bold text-orange-700 mb-2">{formatPrice(food.price)}</p>
                  )}
                  {food.desc && (
                    <p className="text-sm text-gray-600 leading-relaxed">{food.desc}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 메뉴 - 전체 */}
        {regularFoods.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900">🍽️ 전체 메뉴 ({regularFoods.length}개)</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">메뉴</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 w-24">가격</th>
                  </tr>
                </thead>
                <tbody>
                  {regularFoods.map((food, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">{food.name}</span>
                        {food.desc && (
                          <span className="block text-xs text-gray-500 mt-0.5 line-clamp-1">{food.desc}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-700 whitespace-nowrap">
                        {formatPrice(food.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 편의시설 상세 */}
        {area.facilities.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900">🏢 편의시설 ({area.facilities.length}개)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {area.facilities.map((fac, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{fac.name}</h3>
                    {fac.openTime && fac.closeTime && (
                      <span className="text-xs text-gray-500">
                        {fac.openTime === '00:00' && fac.closeTime === '24:00'
                          ? '24시간'
                          : `${fac.openTime}~${fac.closeTime}`}
                      </span>
                    )}
                  </div>
                  {fac.desc && (
                    <p className="text-sm text-gray-600 leading-relaxed">{fac.desc}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 브랜드 매장 */}
        {area.brands.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900">🏬 브랜드 매장 ({area.brands.length}개)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {area.brands.map((brand, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{brand.name}</h3>
                  {brand.category && (
                    <p className="text-sm text-gray-600 leading-relaxed">{brand.category}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 같은 노선 다른 휴게소 */}
        {sameHighway.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {area.highway}의 다른 휴게소
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sameHighway.map(other => (
                <Link
                  key={other.slug}
                  href={`/rest-area/${other.slug}`}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-400 transition-all"
                >
                  <div>
                    <span className="font-medium text-gray-900">{other.name}휴게소</span>
                    <span className="block text-sm text-gray-500">{other.direction}방향</span>
                  </div>
                  {other.bestFood && (
                    <span className="text-xs text-orange-600">{other.bestFood}</span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
