export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, Car, Calendar, Tag, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import ProductDetailActions from "@/components/ProductDetailActions";
import { supabaseServer } from "@/lib/supabase/server";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { brand: true }
  });

  if (!product) {
    notFound();
  }

  // Sprawdzamy czy dany uzytkownik ma produkt w ulubionych
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  let isFav = false;

  if (user) {
    const favColl = await prisma.collection.findFirst({
       where: { userId: user.id, name: "Ulubione" }
    });
    if (favColl) {
      const existing = await prisma.collectionItem.findFirst({
        where: { collectionId: favColl.id, productId: product.id }
      });
      isFav = !!existing;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Breadcrumbs & Navigation */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link href="/sklep" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Wróć do sklepu
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full mt-10">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Lewa strona - Zdjęcie */}
          <div className="w-full lg:w-1/2 bg-gray-100 relative p-6 md:p-8 lg:p-16 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
            {new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
              <div className="absolute top-8 left-8 z-10 bg-black text-white text-sm font-bold px-4 py-1.5 rounded-lg tracking-wide uppercase">
                Nowość w sklepie
              </div>
            )}
            
            <img 
              src={product.imageUrl || "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=1200"} 
              alt={product.name}
              className="w-full max-w-lg h-auto object-contain drop-shadow-2xl"
            />
          </div>

          {/* Prawa strona - Detale */}
          <div className="w-full lg:w-1/2 p-6 md:p-8 lg:p-16 flex flex-col">
            <div className="mb-6">
              <span className="inline-block py-1.5 px-3 rounded-md bg-orange-50 text-orange-600 text-xs font-bold tracking-widest uppercase mb-4">
                {product.brand?.name || "Marka nieznana"}
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>
              <div className="text-4xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-8">
                {Number(product.price).toFixed(2)} <span className="text-xl text-gray-500 font-medium">zł</span>
              </div>
            </div>

            {/* Specyfikacja w pigułce */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Tag className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Marka</p>
                  <p className="font-bold text-gray-900">{product.brand?.name || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Car className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Skala</p>
                  <p className="font-bold text-gray-900">{product.scale || "1:64"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Rocznik</p>
                  <p className="font-bold text-gray-900">{product.year || "-"}</p>
                </div>
              </div>
            </div>

            {/* Opis */}
            <div className="mb-10">
              <h3 className="font-bold text-lg text-gray-900 mb-3">Opis modelu</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description || "Brak szczegółowego opisu dla tego modelu. Niestety, w tej chwili nie posiadamy więcej informacji na temat uwarunkowań historycznych tego pojazdu w świecie miniaturowej motoryzacji."}
              </p>
            </div>

            {/* Akcje - Client Component (Koszyk, Ulubione) */}
            <div className="mt-auto">
               <ProductDetailActions productId={product.id} isFavInitial={isFav} stock={product.stock} />
            </div>

            {/* Guarantees */}
            <div className="mt-8 flex flex-col sm:flex-row gap-6 pt-6 border-t border-gray-100 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                Ochrona Kupującego
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-500" />
                Szybka dostawa
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
