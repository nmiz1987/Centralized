'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormInput } from './ui/Form';
import { SearchIcon } from 'lucide-react';
import { useCallback, useState, useDeferredValue, useEffect } from 'react';

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') || '';
  const [searchValue, setSearchValue] = useState(currentSearch);
  const deferredSearch = useDeferredValue(searchValue);

  const handleSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      router.push(`/dashboard?${params.toString()}`);
    },
    [router, searchParams],
  );

  useEffect(() => {
    handleSearch(deferredSearch);
  }, [deferredSearch, handleSearch]);

  return (
    <div className="relative">
      <FormInput
        type="search"
        name="search"
        placeholder="Search links..."
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        className="pl-10"
      />
      <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
    </div>
  );
}
