"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

export default function StoreFilters({
  categories,
  brands,
  hasFilters,
}: {
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  hasFilters: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper do przełączania wartości w tablicy parametrów
  const toggleParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.getAll(key);

    if (currentValues.includes(value)) {
      // Usuń wartość z listy
      const newValues = currentValues.filter((v) => v !== value);
      params.delete(key);
      newValues.forEach((v) => params.append(key, v));
    } else {
      // Dodaj nową
      params.append(key, value);
    }
    
    // reset do 1 strony jesli jest ew
    // push
    router.push(`/sklep?${params.toString()}`, { scroll: false });
  };

  const currentCategories = searchParams.getAll("categoryId");
  const currentBrands = searchParams.getAll("brandId");
  const currentScales = searchParams.getAll("scale");
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";

  const handlePriceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMin = formData.get("min") as string;
    const newMax = formData.get("max") as string;
    
    const params = new URLSearchParams(searchParams.toString());
    if (newMin) params.set("min", newMin);
    else params.delete("min");
    
    if (newMax) params.set("max", newMax);
    else params.delete("max");

    router.push(`/sklep?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" /> Filtry
          </h2>
          {hasFilters && (
            <Link
              href="/sklep"
              className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
            >
              Wyczyść
            </Link>
          )}
        </div>

        <div className="space-y-6">
          {/* Kategorie */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
              Kategorie
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={currentCategories.includes(cat.id)}
                    onChange={() => toggleParam("categoryId", cat.id)}
                    className="w-5 h-5 border-gray-300 rounded text-orange-500 focus:ring-orange-500 cursor-pointer"
                  />
                  <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Marka */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
              Marka
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {brands.map((b) => (
                <label key={b.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={currentBrands.includes(b.id)}
                    onChange={() => toggleParam("brandId", b.id)}
                    className="w-5 h-5 border-gray-300 rounded text-orange-500 focus:ring-orange-500 cursor-pointer"
                  />
                  <span className="text-gray-600 group-hover:text-gray-900 transition-colors text-sm">
                    {b.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Skala */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
              Skala
            </h3>
            <div className="flex flex-wrap gap-2">
              {["1:64", "1:43", "1:18"].map((scale) => {
                const isActive = currentScales.includes(scale);
                return (
                  <button
                    key={scale}
                    onClick={() => toggleParam("scale", scale)}
                    className={`px-3 py-1.5 border rounded-lg text-sm transition-all cursor-pointer ${
                      isActive
                        ? "bg-black text-white border-black"
                        : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
                    }`}
                  >
                    {scale}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cena */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
              Cena (zł)
            </h3>
            <form onSubmit={handlePriceSubmit} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="min"
                  defaultValue={min}
                  placeholder="Od"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-gray-400"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  name="max"
                  defaultValue={max}
                  placeholder="Do"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-gray-400"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white font-bold py-2 rounded-xl hover:bg-orange-600 transition-colors shadow-sm text-sm"
              >
                Zastosuj cenę
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
