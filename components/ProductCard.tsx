"use client";

import { ShoppingCart, Heart, Star } from "lucide-react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { toggleFavorite } from "@/app/sklep/actions";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductCard({ p, isFavInitial }: { p: any, isFavInitial: boolean }) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isFav, setIsFav] = useState(isFavInitial);
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addItem(p.id);
    setIsAdding(false);
  };

  const handleToggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = await toggleFavorite(p.id);
    if (newStatus.error) {
      router.push("/login");
      return;
    }
    setIsFav(newStatus.status === "added");
  };

  return (
    <Link href={`/sklep/${p.id}`} className="bg-white group rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative block">
      {/* Product Image Area */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden p-4 flex items-center justify-center">
        {/* Tags */}
        {new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
          <div className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-bold px-2.5 py-1 rounded-md tracking-wide pointer-events-none">
            NOWOŚĆ
          </div>
        )}
        <button 
          onClick={handleToggleFav}
          className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isFav ? 'text-red-500 bg-red-50' : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white'}`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500' : ''}`} />
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
              {p.brand?.name || "ZBIORCZY"}
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
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-10 h-10 text-white rounded-full flex items-center justify-center transition-all shadow-md ${isAdding ? 'bg-orange-400' : 'bg-black hover:bg-orange-500 hover:scale-110'}`}
          >
            <ShoppingCart className={`w-4 h-4 mr-0.5 ${isAdding ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>
    </Link>
  );
}
