export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Package, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { deleteProduct } from "./actions";

export default async function ProductsPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return (
      <div className="p-10 flex justify-center">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500">Brak dostępu</p>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: data.user.id },
  });

  if (user?.role !== "ADMIN") {
    return (
      <div className="p-10 flex justify-center">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500">Brak uprawnień</p>
        </div>
      </div>
    );
  }

  const products = await prisma.product.findMany({
    where: { auction: null },
    orderBy: { createdAt: "desc" },
    include: { brand: true }
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
                <Package className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Produkty</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/admin/attributes"
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              Zarządzaj słownikami
            </Link>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Dodaj produkt
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 mt-4">
        {products.length === 0 ? (
          <div className="bg-white border border-gray-200 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Brak produktów</h3>
            <p className="text-gray-500 max-w-sm mb-6">W twoim sklepie nie ma jeszcze żadnych resoraków. Dodaj swój pierwszy produkt, aby zacząć sprzedaż.</p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Dodaj pierwszy produkt
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="py-4 px-6 w-16">Zdjęcie</th>
                    <th className="py-4 px-6">Nazwa modelu</th>
                    <th className="py-4 px-6">Marka</th>
                    <th className="py-4 px-6">Skala</th>
                    <th className="py-4 px-6">Cena</th>
                    <th className="py-4 px-6">Data dodania</th>
                    <th className="py-4 px-6 text-right">Akcje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{p.id.substring(0, 8)}...</div>
                      </td>
                      <td className="py-4 px-6">
                        {p.brand ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 text-xs font-medium">
                            {p.brand.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {p.scale ? (
                          <span className="text-gray-600 text-sm">{p.scale}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">{Number(p.price).toFixed(2)} zł</div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {new Date(p.createdAt).toLocaleDateString("pl-PL")}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/products/${p.id}/edit`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            Edytuj
                          </Link>
                          <form action={deleteProduct}>
                            <input type="hidden" name="id" value={p.id} />
                            <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-800">
                              Usuń
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
