export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, SlidersHorizontal, ShoppingCart } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";
import StoreFilters from "@/components/StoreFilters";
import { supabaseServer } from "@/lib/supabase/server";

export default async function SklepPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams?.q === 'string' ? resolvedParams.q : '';
  
  const categoryParam = resolvedParams?.categoryId;
  const categoryList = categoryParam ? (Array.isArray(categoryParam) ? categoryParam : [categoryParam]) : [];
  
  const brandParam = resolvedParams?.brandId;
  const brandList = brandParam ? (Array.isArray(brandParam) ? brandParam : [brandParam]) : [];
  
  const scaleParam = resolvedParams?.scale;
  const scaleList = scaleParam ? (Array.isArray(scaleParam) ? scaleParam : [scaleParam]) : [];

  const min = typeof resolvedParams?.min === 'string' ? Number(resolvedParams.min) : undefined;
  const max = typeof resolvedParams?.max === 'string' ? Number(resolvedParams.max) : undefined;
  const sort = typeof resolvedParams?.sort === 'string' ? resolvedParams.sort : 'newest';

  // Build the DB 'where' object dynamically
  let where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { scale: { contains: q, mode: 'insensitive' } },
      { brand: { name: { contains: q, mode: 'insensitive' } } },
      { category: { name: { contains: q, mode: 'insensitive' } } }
    ];
  }
  if (categoryList.length > 0) {
    where.categoryId = { in: categoryList };
  }
  if (brandList.length > 0) {
    where.brandId = { in: brandList };
  }
  if (scaleList.length > 0) {
    where.scale = { in: scaleList };
  }
  if (min !== undefined && !isNaN(min)) {
    where.price = { ...where.price, gte: min };
  }
  if (max !== undefined && !isNaN(max)) {
    where.price = { ...where.price, lte: max };
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === 'price-asc') orderBy = { price: "asc" };
  else if (sort === 'price-desc') orderBy = { price: "desc" };

  const hasFilters = q !== '' || categoryList.length > 0 || brandList.length > 0 || scaleList.length > 0 || min !== undefined || max !== undefined || sort !== 'newest';

  // Ukrywamy produkty niedostępne w magazynie oraz produkty będące na aukcji
  where.stock = { gt: 0 };
  where.auction = null;

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { brand: true, category: true }
  });

  const categories = await prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
  const brands = await prisma.brand.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });

  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  let userFavs: string[] = [];

  if (user) {
     const favColl = await prisma.collection.findFirst({
        where: { userId: user.id, name: "Ulubione" },
        include: { items: true }
     });
     if (favColl) {
        userFavs = favColl.items.map(i => i.productId);
     }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-200 py-12 md:py-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-70"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold tracking-wide mb-4">
              Oficjalny Sklep
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
              Kolekcja unikalnych modeli resoraków.
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Odkryj niezwykłe rarytasy, edycje limitowane i nowości, które dopełnią Twoją gablotę.
            </p>
            
            {/* Search Bar */}
            <form key={JSON.stringify(resolvedParams) + "search"} action="/sklep" method="GET" className="flex w-full max-w-lg items-center bg-white border border-gray-300 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 overflow-hidden transition-all">
              <div className="pl-4 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                name="q"
                defaultValue={q}
                placeholder="Szukaj marki, modelu, skali..." 
                className="w-full py-3 px-4 outline-none text-gray-700 bg-transparent"
              />
              <button type="submit" className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors">
                Szukaj
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 w-full flex-1 flex flex-col md:flex-row gap-8">
        


        {/* Sidebar Filters */}
        <StoreFilters 
          categories={categories} 
          brands={brands} 
          hasFilters={hasFilters} 
        />

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <p className="text-gray-500 font-medium">Znaleziono {products.length} produktów</p>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">Sortuj:</span>
              <SortSelect currentSort={sort} />
            </div>
          </div>

          {products.length === 0 ? (
             <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Brak produktów w sklepie</h3>
                <p className="text-gray-500 max-w-md mx-auto">W tym momencie nie mamy żadnych modeli spełniających Twoje kryteria. Odwiedź nas ponownie wkrótce!</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} p={{...p, price: Number(p.price)}} isFavInitial={userFavs.includes(p.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
