export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, SlidersHorizontal, ShoppingCart, Star, Heart, ArrowRight } from "lucide-react";

export default async function SklepPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

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
            <div className="flex w-full max-w-lg items-center bg-white border border-gray-300 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 overflow-hidden transition-all">
              <div className="pl-4 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Szukaj marki, modelu, skali..." 
                className="w-full py-3 px-4 outline-none text-gray-700 bg-transparent"
              />
              <button className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors">
                Szukaj
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 w-full flex-1 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" /> Filtry
              </h2>
            </div>
            
            {/* Filter Categories */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Kategorie</h3>
                <div className="space-y-2">
                  {['Hot Wheels', 'Matchbox', 'Majorette', 'Siku', 'Premium'].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 border border-gray-300 rounded overflow-hidden flex items-center justify-center pt-0.5 group-hover:border-orange-500 transition-colors">
                        {/* Custom checkbox styling can go here */}
                      </div>
                      <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Skala</h3>
                <div className="flex flex-wrap gap-2">
                  {['1:64', '1:43', '1:18', 'Inne'].map((scale) => (
                    <button key={scale} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-black hover:text-black transition-all">
                      {scale}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Cena</h3>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-gray-400" />
                  <span className="text-gray-400">-</span>
                  <input type="number" placeholder="Max" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-500 font-medium">Znaleziono {products.length} produktów</p>
            <select className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg outline-none focus:ring-2 focus:ring-black/5 text-sm font-medium cursor-pointer">
              <option>Od najnowszych</option>
              <option>Cena: rosnąco</option>
              <option>Cena: malejąco</option>
            </select>
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
                <div key={p.id} className="bg-white group rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  {/* Product Image Area */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden p-4 flex items-center justify-center">
                    {/* Tags */}
                    {p.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                      <div className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-bold px-2.5 py-1 rounded-md tracking-wide">
                        NOWOŚĆ
                      </div>
                    )}
                    <button className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all">
                      <Heart className="w-4 h-4" />
                    </button>
                    
                    {/* Image */}
                    <img 
                      src={p.imageUrl || "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800"} 
                      alt={p.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase tracking-wider">
                          {p.brand || "ZBIORCZY"}
                       </span>
                       {p.scale && <span className="text-xs text-gray-500 font-medium">Skala {p.scale}</span>}
                    </div>
                    
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2">
                      {p.name}
                    </h3>

                    {/* Ratings mockup */}
                    <div className="flex items-center gap-1 mb-4">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                       ))}
                       <span className="text-xs text-gray-500 ml-1">(12)</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="font-black text-xl text-gray-900">
                        {Number(p.price).toFixed(2)} <span className="text-sm font-medium text-gray-500">zł</span>
                      </div>
                      <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-orange-500 hover:scale-110 transition-all shadow-md">
                        <ShoppingCart className="w-4 h-4 mr-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
