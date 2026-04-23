"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Car, Info, Gavel, FolderTree, Tags, DollarSign, ImageIcon, Clock } from "lucide-react";

export default function AuctionForm({ categories = [], brands = [], actionFn }: { categories?: any[], brands?: any[], actionFn: (formData: FormData) => Promise<any> }) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAction(formData: FormData) {
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await actionFn(formData);
      if (result && result.error) {
        setError(result.error);
        setIsSubmitting(false);
      }
    } catch (e: any) {
      setError(e.message || "Wystąpił nieoczekiwany błąd");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10 pr-24">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Gavel className="w-6 h-6 text-white/80" />
              Wystaw model na licytację
            </h2>
            <p className="text-white/80">Dodaj produkt i rozpocznij aukcję, aby znaleźć kupca dla swojego okazu.</p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">Szczegóły Aukcji</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tytuł aukcji <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Gavel className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="title"
                    required
                    placeholder="np. Unikalny Ford Mustang GT 1968"
                    className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Cena wyjściowa (PLN) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="startingPrice"
                    required
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="10.00"
                    className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Czas trwania aukcji <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="durationDays"
                    required
                    defaultValue="7"
                    className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all appearance-none bg-white"
                  >
                    <option value="1">1 dzień</option>
                    <option value="3">3 dni</option>
                    <option value="7">7 dni</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">Parametry Produktu</h3>
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
                    placeholder="np. Ford Mustang GT"
                    className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Marka</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tags className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="brandId"
                    className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all appearance-none bg-white"
                  >
                    <option value="">-- Wybierz --</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategoria</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FolderTree className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="categoryId"
                    className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all appearance-none bg-white"
                  >
                    <option value="">-- Wybierz --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Skala</label>
                <input
                  name="scale"
                  placeholder="np. 1:64"
                  className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Zdjęcie (URL)</label>
                <input
                  name="imageUrl"
                  type="url"
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Opis produktu</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Opisz stan modelu, jego historię, uszkodzenia itd."
                  className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-y"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Link href="/dashboard" className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Anuluj
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 bg-black text-white font-medium px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Gavel className="w-5 h-5" />
              {isSubmitting ? "Zapisywanie..." : "Rozpocznij Aukcję"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
