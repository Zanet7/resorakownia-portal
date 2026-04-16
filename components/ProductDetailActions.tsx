"use client";

import { ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartContext";
import { toggleFavorite } from "@/app/sklep/actions";
import { useRouter } from "next/navigation";

export default function ProductDetailActions({ productId, isFavInitial }: { productId: string, isFavInitial: boolean }) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isFav, setIsFav] = useState(isFavInitial);
  const router = useRouter();

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addItem(productId);
    setIsAdding(false);
  };

  const handleToggleFav = async () => {
    const newStatus = await toggleFavorite(productId);
    if (newStatus.error) {
      router.push("/login");
      return;
    }
    setIsFav(newStatus.status === "added");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      <button 
        onClick={handleAddToCart}
        disabled={isAdding}
        className="flex-1 bg-black text-white px-8 py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:bg-orange-500 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-orange-500/10 disabled:opacity-70"
      >
        <ShoppingCart className={`w-6 h-6 ${isAdding ? 'animate-bounce' : ''}`} />
        {isAdding ? "Dodawanie..." : "Do koszyka"}
      </button>

      <button 
        onClick={handleToggleFav}
        className={`px-8 py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 border-2 transition-all duration-300 ${isFav ? 'border-red-100 bg-red-50 text-red-500 hover:bg-red-100/50' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}
      >
        <Heart className={`w-6 h-6 ${isFav ? 'fill-red-500' : ''}`} />
        {isFav ? 'W ulubionych' : 'Do ulubionych'}
      </button>
    </div>
  );
}
