"use client";

import { useState } from "react";
import { 
  Car, Plus, Trash2, Gavel, DollarSign, 
  Layers, Search, X, Calendar, Maximize2, 
  Tag, Eye, CheckCircle2, AlertCircle 
} from "lucide-react";
import Link from "next/link";
import { addToCollection, removeFromCollection, listCollectionItemOnAuction } from "../app/kolekcjonerstwo/actions";

interface Product {
  id: string;
  name: string;
  scale: string | null;
  year: number | null;
  description: string | null;
  imageUrl: string | null;
  price: any;
  stock: number;
  brandId: string | null;
  categoryId: string | null;
  brand?: { name: string } | null;
  category?: { name: string } | null;
  auction?: {
    id: string;
    title: string;
    currentPrice: any;
    status: string;
  } | null;
}

interface GarageClientProps {
  initialProducts: Product[];
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  stats: {
    totalCount: number;
    uniqueBrands: number;
    estimatedValue: number;
  };
}

export default function GarageClient({ 
  initialProducts, 
  categories, 
  brands, 
  stats 
}: GarageClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // Modale
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [activeProductForAuction, setActiveProductForAuction] = useState<Product | null>(null);

  // Statusy i komunikaty
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrowanie
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (p.brand?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === "" || p.brandId === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  // Dodawanie do kolekcji
  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await addToCollection(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setSuccess("Model został pomyślnie dodany do Twojej kolekcji!");
      setIsSubmitting(false);
      // Krótkie opóźnienie przed zamknięciem i przeładowaniem strony
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Usuwanie z kolekcji
  const handleRemove = async (productId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten model z kolekcji?")) return;

    setError(null);
    setSuccess(null);
    const result = await removeFromCollection(productId);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Model został usunięty z kolekcji.");
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  // Wystawianie na aukcję
  const handleAuctionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await listCollectionItemOnAuction(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setSuccess("Model został pomyślnie wystawiony na licytację!");
      setIsSubmitting(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const openAuctionModal = (product: Product) => {
    setActiveProductForAuction(product);
    setShowAuctionModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Powiadomienia */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
              <Car className="w-8 h-8 text-orange-500" /> Cyfrowy Garaż
            </h1>
            <p className="text-gray-600 max-w-xl">
              Twoja prywatna witryna kolekcjonerska. Zarządzaj swoimi modelami i wystawiaj je bezpośrednio na aukcje.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold px-6 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5" /> Dodaj model
          </button>
        </div>

        {/* Statystyki */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 flex items-center gap-5 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm text-gray-400 font-semibold uppercase">Modele w Garażu</div>
              <div className="text-3xl font-black text-gray-900">{stats.totalCount}</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 flex items-center gap-5 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm text-gray-400 font-semibold uppercase">Producenci / Serie</div>
              <div className="text-3xl font-black text-gray-900">{stats.uniqueBrands}</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 flex items-center gap-5 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center">
              <DollarSign className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm text-gray-400 font-semibold uppercase">Szacowana Wartość</div>
              <div className="text-3xl font-black text-gray-900">{stats.estimatedValue.toFixed(2)} PLN</div>
            </div>
          </div>
        </div>

        {/* Filtry i wyszukiwarka */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Wyszukaj model po nazwie lub marce..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
            />
          </div>
          <select
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm font-medium text-gray-700"
          >
            <option value="">Wszystkie marki</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Siatka Garażu */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center">
            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Car className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Twój garaż jest pusty</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              Dodaj swoje resoraki, aby stworzyć cyfrową kolekcję i móc wygodnie wystawiać je na licytację.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" /> Dodaj pierwszy model
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div 
                key={p.id} 
                className="bg-white group rounded-3xl border border-gray-200/80 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
              >
                {/* Zdjęcie */}
                <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden p-4 flex items-center justify-center border-b border-gray-100">
                  <img
                    src={p.imageUrl || "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800"}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Status badge */}
                  <div className="absolute top-4 left-4">
                    {p.auction ? (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        NA AUKCJI
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        W GARAŻU
                      </span>
                    )}
                  </div>
                </div>

                {/* Zawartość */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-orange-500 uppercase tracking-widest">
                        {p.brand?.name || "ZBIORCZY"}
                      </span>
                      {p.scale && (
                        <span className="text-gray-400">Skala {p.scale}</span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-lg leading-tight group-hover:text-orange-500 transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                      {p.year && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {p.year}
                        </span>
                      )}
                      {p.category && (
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" /> {p.category.name}
                        </span>
                      )}
                    </div>
                    {p.description && (
                      <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed pt-1">
                        {p.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs text-gray-400 font-bold uppercase">
                        {p.auction ? "Aktualna oferta" : "Szac. wartość"}
                      </div>
                      <div className="text-lg font-black text-gray-950">
                        {p.auction 
                          ? `${Number(p.auction.currentPrice).toFixed(2)} PLN`
                          : `${Number(p.price).toFixed(2)} PLN`
                        }
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {p.auction ? (
                        <Link
                          href={`/aukcje/${p.auction.id}`}
                          className="flex-1 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 text-center font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Eye className="w-4 h-4" /> Zobacz aukcję
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={() => openAuctionModal(p)}
                            className="flex-1 bg-black text-white hover:bg-orange-500 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                          >
                            <Gavel className="w-4 h-4" /> Wystaw
                          </button>
                          <button
                            onClick={() => handleRemove(p.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-xl border border-red-100 transition-all active:scale-95 shrink-0"
                            title="Usuń z kolekcji"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Dodawanie do kolekcji */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-250 max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Car className="w-5 h-5 text-orange-500" /> Nowy model w garażu
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nazwa modelu *</label>
                  <input required name="name" type="text" placeholder="np. Toyota AE86 Sprinter Trueno" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Producent / Seria</label>
                    <select name="brandId" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm">
                      <option value="">Wybierz...</option>
                      {brands.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kategoria</label>
                    <select name="categoryId" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm">
                      <option value="">Wybierz...</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Skala</label>
                    <input name="scale" type="text" placeholder="np. 1:64" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Rok produkcji</label>
                    <input name="year" type="number" placeholder="np. 2021" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Wycena (PLN)</label>
                    <input name="price" type="number" step="0.01" defaultValue="0" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-bold" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">URL Zdjęcia</label>
                  <input name="imageUrl" type="url" placeholder="https://example.com/resorak.jpg" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                  <span className="text-[10px] text-gray-400">Pozostaw puste, aby użyć domyślnego zdjęcia.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Krótki opis / uwagi</label>
                  <textarea name="description" rows={3} placeholder="np. Stan idealny, oryginalne opakowanie (blister), limitowana seria." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none"></textarea>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition-colors"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-75"
                  >
                    {isSubmitting ? "Zapisywanie..." : "Zapisz w garażu"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Wystawianie na aukcję */}
        {showAuctionModal && activeProductForAuction && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-250">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-orange-500" /> Wystaw model na licytację
                </h3>
                <button 
                  onClick={() => setShowAuctionModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAuctionSubmit} className="p-6 space-y-4">
                <input type="hidden" name="productId" value={activeProductForAuction.id} />
                
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex gap-3 items-center">
                  <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                    <img 
                      src={activeProductForAuction.imageUrl || "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800"} 
                      alt="" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-orange-500 uppercase">{activeProductForAuction.brand?.name || "ZBIORCZY"}</div>
                    <div className="font-bold text-gray-900 text-sm truncate">{activeProductForAuction.name}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tytuł aukcji *</label>
                  <input 
                    required 
                    name="title" 
                    type="text" 
                    defaultValue={`Licytacja: ${activeProductForAuction.name}`} 
                    placeholder="np. Rzadki Hot Wheels Porsche 911 w stanie idealnym!" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cena wywoławcza (PLN) *</label>
                    <input 
                      required 
                      name="startingPrice" 
                      type="number" 
                      step="0.01" 
                      defaultValue={Number(activeProductForAuction.price) > 0 ? Number(activeProductForAuction.price).toString() : "1.00"} 
                      placeholder="Cena poczatkowa" 
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-bold text-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Czas trwania aukcji *</label>
                    <select name="durationDays" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium text-gray-700">
                      <option value="3">3 dni</option>
                      <option value="5">5 dni</option>
                      <option value="7">7 dni</option>
                      <option value="14">14 dni</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAuctionModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition-colors"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-black hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-75 flex items-center justify-center gap-2"
                  >
                    <Gavel className="w-4 h-4" /> {isSubmitting ? "Wystawianie..." : "Rozpocznij aukcję"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
