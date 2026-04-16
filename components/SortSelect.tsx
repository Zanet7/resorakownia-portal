"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    // Zachowujemy resztę filtrów w URL i po prostu robimy push
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <select 
        name="sort" 
        value={currentSort} 
        onChange={handleSortChange} 
        className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg outline-none focus:ring-2 focus:ring-black/5 text-sm font-medium cursor-pointer"
    >
      <option value="newest">Od najnowszych</option>
      <option value="price-asc">Cena: rosnąco</option>
      <option value="price-desc">Cena: malejąco</option>
    </select>
  );
}
