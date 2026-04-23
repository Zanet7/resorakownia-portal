"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { cancelAuction } from "@/app/aukcje/actions";

export default function CancelAuctionButton({ auctionId }: { auctionId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm("Czy na pewno chcesz bezpowrotnie usunąć/anulować tę aukcję? Licytacja zostanie przerwana.")) return;
    
    setIsDeleting(true);
    try {
      await cancelAuction(auctionId);
    } catch (e: any) {
      alert(e.message || "Błąd podczas usuwania.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleCancel}
      disabled={isDeleting}
      className={`text-red-600 hover:text-red-800 transition-colors p-1.5 rounded-lg hover:bg-red-50 flex items-center justify-center ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="Anuluj aukcję"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
