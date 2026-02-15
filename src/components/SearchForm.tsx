'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { SearchRestArea } from '@/lib/types';

interface SearchFormProps {
  restAreas: SearchRestArea[];
}

export default function SearchForm({ restAreas }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchRestArea[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const q = value.toLowerCase();
    const filtered = restAreas.filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        r.highway.toLowerCase().includes(q) ||
        r.bestFood.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q)
    ).slice(0, 8);

    setResults(filtered);
    setIsOpen(filtered.length > 0);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="휴게소명, 고속도로, 대표 음식으로 검색..."
          className="w-full px-4 py-3 pr-12 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none text-gray-900 bg-white shadow-sm"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map(area => (
            <Link
              key={area.slug}
              href={`/rest-area/${area.slug}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-emerald-50 border-b border-gray-100 last:border-b-0"
              onClick={() => setIsOpen(false)}
            >
              <div>
                <span className="font-medium text-gray-900">{area.name}휴게소</span>
                <span className="text-sm text-gray-500 ml-2">
                  {area.highway} {area.direction}방향
                </span>
              </div>
              {area.bestFood && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  🍽️ {area.bestFood}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
