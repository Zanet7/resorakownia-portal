"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, PackagePlus, Info, DollarSign, Ruler, Car, Image as ImageIcon, Sparkles, Save, FolderTree, Tags } from "lucide-react";

export default function ProductForm({ initialData, categories = [], brands = [], actionFn, title, subtitle }: { initialData?: any, categories?: any[], brands?: any[], actionFn: (formData: FormData) => Promise<any>, title: string, subtitle: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
    } catch (e: any) {
      setError(e.message || "Wystąpił nieoczekiwany błąd");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 text-green-600 p-2 rounded-xl">
                {initialData ? <Save className="w-5 h-5" /> : <PackagePlus className="w-5 h-5" />}
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10 mt-4">
        
        {/* Banner */}
        <div className={`bg-gradient-to-r ${initialData ? 'from-purple-600 to-indigo-600' : 'from-blue-600 to-indigo-600'} rounded-2xl p-8 mb-8 text-white relative overflow-hidden shadow-lg shadow-blue-900/20`}>
          <div className="relative z-10 pr-24">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-white/80" />
              {title}
            </h2>
            <p className="text-white/80">{subtitle}</p>
          </div>
          <Car className="w-48 h-48 absolute -right-8 -bottom-10 text-white/10 rotate-12" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-8 flex items-start gap-3">
            <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm font-medium">{error}</div>
          </div>
        )}

        <form action={handleAction} className="space-y-8">
          
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">Podstawowe informacje</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nazwa modelu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Car className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="name"
                    required
                    defaultValue={initialData?.name || ""}
                    placeholder="np. Ford Mustang GT 1968"
                    className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                  />
                </div>
              </div>

              {/* SŁOWNIKI */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Marka producenta
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tags className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="brandId"
                    defaultValue={initialData?.brandId || ""}
                    className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all appearance-none cursor-pointer bg-white"
                  >
                    <option value="">-- Wybierz lub zostaw puste --</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kategoria
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FolderTree className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="categoryId"
                    defaultValue={initialData?.categoryId || ""}
                    className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all appearance-none cursor-pointer bg-white"
                  >
                    <option value="">-- Wybierz lub zostaw puste --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Skala <span className="text-gray-400 font-normal ml-1">(opcjonalnie)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Ruler className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="scale"
                    defaultValue={initialData?.scale || ""}
                    placeholder="np. 1:64"
                    className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">Wycena i multimedia</h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Cena brutto (PLN) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="price"
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={initialData ? Number(initialData.price).toFixed(2) : ""}
                    placeholder="0.00"
                    className="w-full sm:w-1/2 border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Link do zdjęcia <span className="text-gray-400 font-normal ml-1">(Adres URL)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="imageUrl"
                    type="url"
                    defaultValue={initialData?.imageUrl || ""}
                    placeholder="https://... (pozostaw puste dla generowanego obrazu)"
                    className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">Szczegóły</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pełny opis produktu</label>
              <textarea
                name="description"
                rows={5}
                defaultValue={initialData?.description || ""}
                placeholder="Napisz więcej o tym modelu..."
                className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-y"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Link href="/admin/products" className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Anuluj
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 bg-black text-white font-medium px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {initialData ? <Save className="w-5 h-5" /> : <PackagePlus className="w-5 h-5" />}
              {isSubmitting ? "Zapisywanie..." : (initialData ? "Zapisz zmiany" : "Dodaj produkt")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
