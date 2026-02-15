'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { label: '고속도로', href: '/highway' },
  { label: '휴게소', href: '/rest-area' },
  { label: '맛집', href: '/food' },
  { label: '명절 특집', href: '/holiday' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="bg-emerald-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg md:text-xl font-bold hover:opacity-90 shrink-0">
            🛣️ 고속도로 휴게소
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-5 text-sm md:text-base">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:underline transition-opacity ${
                  isActive(item.href) ? 'font-bold underline' : 'opacity-85 hover:opacity-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1"
            aria-label="메뉴 열기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden mt-3 pt-3 border-t border-emerald-500 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive(item.href)
                    ? 'bg-emerald-500 font-bold'
                    : 'hover:bg-emerald-500/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
