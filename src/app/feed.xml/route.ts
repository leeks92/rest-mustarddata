import { getAllRestAreas, getAllHighways, getMetadata, getPopularRestAreas } from '@/lib/data';

// output: 'export' 호환을 위한 설정
export const dynamic = 'force-static';

const BASE_URL = 'https://rest.mustarddata.com';

export async function GET() {
  const now = new Date();
  const metadata = getMetadata();
  const highways = getAllHighways();
  const popularRestAreas = getPopularRestAreas(20);
  const lastUpdated = metadata?.lastUpdated ? new Date(metadata.lastUpdated).toUTCString() : now.toUTCString();

  const items: string[] = [];

  // 메인 페이지
  items.push(`
    <item>
      <title><![CDATA[전국 고속도로 휴게소 정보 - 맛집, 편의시설, 대표 메뉴]]></title>
      <link>${BASE_URL}</link>
      <guid>${BASE_URL}</guid>
      <description><![CDATA[전국 고속도로 휴게소 정보를 한눈에! 경부·서해안·영동·호남 등 노선별 휴게소 맛집, 대표 음식, 편의시설 정보를 제공합니다.]]></description>
      <pubDate>${lastUpdated}</pubDate>
    </item>`);

  // 고속도로 목록 페이지
  items.push(`
    <item>
      <title><![CDATA[고속도로 노선별 휴게소 목록]]></title>
      <link>${BASE_URL}/highway</link>
      <guid>${BASE_URL}/highway</guid>
      <description><![CDATA[경부고속도로, 서해안고속도로, 영동고속도로 등 전국 고속도로 노선별 휴게소 목록을 확인하세요.]]></description>
      <pubDate>${lastUpdated}</pubDate>
    </item>`);

  // 휴게소 목록 페이지
  items.push(`
    <item>
      <title><![CDATA[전국 고속도로 휴게소 전체 목록]]></title>
      <link>${BASE_URL}/rest-area</link>
      <guid>${BASE_URL}/rest-area</guid>
      <description><![CDATA[전국 고속도로 휴게소 전체 목록입니다. 휴게소별 편의시설, 대표 메뉴, 위치 정보를 확인하세요.]]></description>
      <pubDate>${lastUpdated}</pubDate>
    </item>`);

  // 휴게소 맛집 페이지
  items.push(`
    <item>
      <title><![CDATA[고속도로 휴게소 맛집·대표 음식 정보]]></title>
      <link>${BASE_URL}/food</link>
      <guid>${BASE_URL}/food</guid>
      <description><![CDATA[전국 고속도로 휴게소의 대표 음식과 맛집 정보를 확인하세요. 휴게소별 인기 메뉴와 가격 정보를 제공합니다.]]></description>
      <pubDate>${lastUpdated}</pubDate>
    </item>`);

  // 고속도로별 페이지
  highways.forEach(hw => {
    const url = `${BASE_URL}/highway/${hw.slug}`;
    items.push(`
    <item>
      <title><![CDATA[${hw.name} 휴게소 목록 - 편의시설, 맛집 정보]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description><![CDATA[${hw.name}의 휴게소 목록입니다. 각 휴게소의 편의시설, 대표 음식, 위치 정보를 확인하세요.]]></description>
      <pubDate>${lastUpdated}</pubDate>
    </item>`);
  });

  // 인기 휴게소 (대표 음식이 있는 상위 20개)
  popularRestAreas.forEach(area => {
    const url = `${BASE_URL}/rest-area/${area.slug}`;
    items.push(`
    <item>
      <title><![CDATA[${area.name} - ${area.highway} ${area.direction}방향 휴게소]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description><![CDATA[${area.name} 휴게소 정보. 대표 음식: ${area.bestFood || '정보 없음'}. ${area.highway} ${area.direction}방향. 편의시설, 메뉴, 위치 정보를 확인하세요.]]></description>
      <pubDate>${lastUpdated}</pubDate>
    </item>`);
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>전국 고속도로 휴게소 정보 - 맛집, 편의시설</title>
    <link>${BASE_URL}</link>
    <description>전국 고속도로 휴게소 정보를 한눈에! 경부·서해안·영동·호남 등 노선별 휴게소 맛집, 대표 음식, 편의시설 정보를 제공합니다.</description>
    <language>ko</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items.join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=604800, s-maxage=604800',
    },
  });
}
