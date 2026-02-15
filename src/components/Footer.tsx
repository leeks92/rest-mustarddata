import Link from 'next/link';
import SisterSites from './SisterSites';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-3 text-gray-900">고속도로별 휴게소</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <Link href="/highway/gyeongbu" className="hover:text-emerald-600">
                  경부고속도로
                </Link>
              </li>
              <li>
                <Link href="/highway/seohaean" className="hover:text-emerald-600">
                  서해안고속도로
                </Link>
              </li>
              <li>
                <Link href="/highway/yeongdong" className="hover:text-emerald-600">
                  영동고속도로
                </Link>
              </li>
              <li>
                <Link href="/highway/honam" className="hover:text-emerald-600">
                  호남고속도로
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-gray-900">인기 휴게소</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <Link href="/rest-area/haengdamdo" className="hover:text-emerald-600">
                  행담도휴게소
                </Link>
              </li>
              <li>
                <Link href="/rest-area/deogpyeong" className="hover:text-emerald-600">
                  덕평휴게소
                </Link>
              </li>
              <li>
                <Link href="/rest-area/seoulmannam-busan" className="hover:text-emerald-600">
                  서울만남휴게소
                </Link>
              </li>
              <li>
                <Link href="/rest-area/manghyang-busan" className="hover:text-emerald-600">
                  망향휴게소
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-gray-900">유용한 사이트</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <a href="https://www.ex.co.kr" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600">
                  한국도로공사
                </a>
              </li>
              <li>
                <a href="https://data.ex.co.kr" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600">
                  고속도로 공공데이터
                </a>
              </li>
              <li>
                <a href="https://www.roadplus.co.kr" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600">
                  실시간 교통정보
                </a>
              </li>
            </ul>
          </div>
          <div>
            <SisterSites currentSite="rest" />
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-600">
          <p>
            © {currentYear} MustardData. 본 사이트의 정보는 공공데이터를
            기반으로 제공되며, 실제 정보와 다를 수 있습니다.
          </p>
          <p className="mt-2">
            정확한 정보는 한국도로공사 공식 사이트를 이용해 주세요.
          </p>
        </div>
      </div>
    </footer>
  );
}
