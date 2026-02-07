import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-emerald-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg md:text-xl font-bold hover:opacity-90 shrink-0">
            🛣️ 고속도로 휴게소
          </Link>
          <nav className="flex gap-3 md:gap-6 text-sm md:text-base">
            <Link href="/highway" className="hover:underline">
              고속도로
            </Link>
            <Link href="/rest-area" className="hover:underline">
              휴게소
            </Link>
            <Link href="/food" className="hover:underline">
              맛집
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
