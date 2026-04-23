"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

type CancelledAuction = {
  id: string;
  title: string;
};

export default function CancelledBidsAlert({ auctions }: { auctions: CancelledAuction[] }) {
  const [visibleAuctions, setVisibleAuctions] = useState<CancelledAuction[]>([]);

  useEffect(() => {
    const dismissedStr = localStorage.getItem("dismissedCancelledAuctions") || "[]";
    try {
      const dismissedIds: string[] = JSON.parse(dismissedStr);
      const toShow = auctions.filter((a) => !dismissedIds.includes(a.id));
      setVisibleAuctions(toShow);
    } catch (e) {
      setVisibleAuctions(auctions);
    }
  }, [auctions]);

  const handleDismiss = () => {
    const dismissedStr = localStorage.getItem("dismissedCancelledAuctions") || "[]";
    try {
      let dismissedIds: string[] = JSON.parse(dismissedStr);
      const newlyDismissed = visibleAuctions.map(a => a.id);
      dismissedIds = [...new Set([...dismissedIds, ...newlyDismissed])];
      localStorage.setItem("dismissedCancelledAuctions", JSON.stringify(dismissedIds));
    } catch (e) {
      const newlyDismissed = visibleAuctions.map(a => a.id);
      localStorage.setItem("dismissedCancelledAuctions", JSON.stringify(newlyDismissed));
    }
    setVisibleAuctions([]);
  };

  if (visibleAuctions.length === 0) return null;

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 mb-8 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="bg-red-100 p-3 rounded-full text-red-600 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Aukcje zostały usunięte</h3>
          <p className="text-gray-700 text-sm mb-4">
            Sprzedawca zdecydował się anulować poniższe aukcje, w których brałeś udział. Licytacja została przerwana i nie wyłoniła zwycięzcy:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-6">
            {visibleAuctions.map(a => (
              <li key={a.id} className="text-sm font-medium text-red-800">
                <Link href={`/aukcje/${a.id}`} className="hover:underline">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
          <button 
            onClick={handleDismiss}
            className="bg-white text-red-600 border border-red-200 px-6 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-red-50 transition-colors"
          >
            Rozumiem, zamknij to powiadomienie
          </button>
        </div>
      </div>
    </div>
  );
}
