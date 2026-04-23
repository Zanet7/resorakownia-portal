import Link from "next/link";
import { Gavel, Clock, Image as ImageIcon } from "lucide-react";

export default function AuctionCard({ auction }: { auction: any }) {
  const isEndingSoon = new Date(auction.endDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;
  
  // Funkcja formatująca czas do końca
  const timeRemaining = () => {
    const total = new Date(auction.endDate).getTime() - new Date().getTime();
    if (total <= 0) return "Zakończona";
    
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h ${Math.floor((total / 1000 / 60) % 60)}m`;
  };

  return (
    <Link href={`/aukcje/${auction.id}`} className="group flex flex-col bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-red-900/5 hover:-translate-y-1 transition-all duration-300 relative">
      
      {isEndingSoon && new Date(auction.endDate) > new Date() && (
        <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Zaraz koniec
        </div>
      )}

      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {auction.product?.imageUrl ? (
          <img 
            src={auction.product.imageUrl} 
            alt={auction.title} 
            className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-500 relative z-10 drop-shadow-xl"
          />
        ) : (
          <ImageIcon className="w-16 h-16 text-gray-300" />
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
            {auction.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
            {auction.description || auction.product?.description}
          </p>
        </div>
        
        <div className="pt-4 border-t border-gray-100 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Aktualna cena</p>
            <p className="text-2xl font-black text-gray-900">
              {Number(auction.currentPrice).toFixed(2)} zł
            </p>
          </div>
          
          <div className="text-right flex flex-col items-end">
             <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Do końca</p>
             <p className={`text-sm font-bold ${isEndingSoon ? 'text-red-600' : 'text-gray-700'}`}>
               {timeRemaining()}
             </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
