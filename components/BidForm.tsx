"use client";

import { useState } from "react";
import { placeBid } from "@/app/aukcje/actions";
import { Gavel, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BidForm({ auctionId, currentPrice, isEnded }: { auctionId: string, currentPrice: number, isEnded: boolean }) {
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    const bidValue = parseFloat(amount.replace(",", "."));
    
    if (isNaN(bidValue) || bidValue <= currentPrice) {
      setError(`Oferta musi być większa niż ${currentPrice.toFixed(2)} PLN`);
      return;
    }

    setIsSubmitting(true);
    const result = await placeBid(auctionId, bidValue);
    setIsSubmitting(false);

    if (result.error) {
      if (result.error === "unauthorized") {
        router.push("/login");
      } else {
        setError(result.error);
      }
    } else {
      setSuccess(true);
      setAmount("");
    }
  };

  if (isEnded) {
    return (
      <div className="bg-gray-100 rounded-2xl p-6 text-center text-gray-500 font-medium border border-gray-200">
        Licytacja została zakończona. Nie można składać nowych ofert.
      </div>
    );
  }

  return (
    <form onSubmit={handleBid} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-red-500" /> Twoja oferta
      </h3>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium mb-4 border border-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm font-medium mb-4 border border-green-100">
          Twoja oferta została przyjęta! Wygrywasz.
        </div>
      )}

      <div className="flex gap-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-medium">PLN</span>
          <input
            type="number"
            step="0.01"
            min={(currentPrice + 1).toString()}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`${(currentPrice + 5).toFixed(2)}`}
            className="w-full border border-gray-300 rounded-2xl py-4 pl-14 pr-4 text-lg font-bold text-gray-900 focus:ring-2 focus:ring-red-500 outline-none transition-all"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-red-600 text-white px-8 font-bold rounded-2xl hover:bg-red-700 transition-colors shadow-md flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70' : ''}`}
        >
          <Gavel className="w-5 h-5" /> Licytuj
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">
        Składając ofertę zgadzasz się na warunki korzystania z licytacji w Resorakowni. Płatność i wysyłkę ustalisz prywatnie ze sprzedawcą po wygranej.
      </p>
    </form>
  );
}
