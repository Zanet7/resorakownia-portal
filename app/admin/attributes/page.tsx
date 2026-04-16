export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, BookOpen, Plus, Trash2, Tags, Layers } from "lucide-react";
import { createAttribute, deleteAttribute } from "./actions";

export default async function AdminAttributesPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return <div className="p-10">Brak dostępu</div>;
  }

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Słowniki (Marki i Kategorie)</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10 mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Kolumna Marek */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
           <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
             <Tags className="w-5 h-5 text-orange-500" />
             Marki Producentów ({brands.length})
           </h3>
           
           <form action={createAttribute} className="flex gap-2 mb-6">
              <input type="hidden" name="type" value="brand" />
              <input 
                name="name" 
                required 
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none text-sm" 
                placeholder="Nowa marka np. Hot Wheels..." 
              />
              <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium">
                <Plus className="w-4 h-4" /> Dodaj
              </button>
           </form>

           <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {brands.map(b => (
                 <li key={b.id} className="flex flex-row items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                   <span className="font-medium text-gray-800">{b.name}</span>
                   <form action={deleteAttribute}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="type" value="brand" />
                      <button type="submit" className="text-gray-400 hover:text-red-500 p-1 transition-colors" title="Usuń wolną markę">
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </form>
                 </li>
              ))}
              {brands.length === 0 && <p className="text-sm text-gray-400 italic">Brak marek w słowniku.</p>}
           </ul>
        </div>

        {/* Kolumna Kategorii */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
           <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
             <Layers className="w-5 h-5 text-purple-500" />
             Główne Kategorie ({categories.length})
           </h3>
           
           <form action={createAttribute} className="flex gap-2 mb-6">
              <input type="hidden" name="type" value="category" />
              <input 
                name="name" 
                required 
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none text-sm" 
                placeholder="Nowa kategoria np. Samochody..." 
              />
              <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium">
                <Plus className="w-4 h-4" /> Dodaj
              </button>
           </form>

           <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {categories.map(c => (
                 <li key={c.id} className="flex flex-row items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                   <span className="font-medium text-gray-800">{c.name}</span>
                   <form action={deleteAttribute}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="type" value="category" />
                      <button type="submit" className="text-gray-400 hover:text-red-500 p-1 transition-colors" title="Usuń wolną kategorię">
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </form>
                 </li>
              ))}
              {categories.length === 0 && <p className="text-sm text-gray-400 italic">Brak kategorii w słowniku.</p>}
           </ul>
        </div>

      </div>
    </div>
  );
}
