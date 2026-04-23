export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Gavel, Search } from "lucide-react";
import AuctionCard from "@/components/AuctionCard";

export default async function AukcjePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams?.q === 'string' ? resolvedParams.q : '';

  let where: any = { status: "ACTIVE" };
  
  if (q) {
    where.title = { contains: q, mode: 'insensitive' };
  }

  // Zamknijmy najpierw przeterminowane aukcje (Lazy Evaluation)
  const activeAuctions = await prisma.auction.findMany({
    where: { status: "ACTIVE" },
    include: { bids: { orderBy: { amount: "desc" }, take: 1 } }
  });

  for (const auction of activeAuctions) {
    if (new Date(auction.endDate) < new Date()) {
      const highestBid = auction.bids[0];
      await prisma.auction.update({
        where: { id: auction.id },
        data: {
          status: "COMPLETED",
          winnerId: highestBid ? highestBid.userId : null
        }
      });
    }
  }

  const auctions = await prisma.auction.findMany({
    where,
    orderBy: { endDate: "asc" },
    include: { product: true }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 py-12 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-70"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-red-600 text-sm font-semibold tracking-wide mb-4">
              Licytacje Użytkowników
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
              Poluj na unikalne okazje.
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Bierz udział w licytacjach modeli wystawionych przez społeczność. Zdobądź ten wymarzony okaz do swojej kolekcji!
            </p>
            
            <form key={JSON.stringify(resolvedParams) + "search"} action="/aukcje" method="GET" className="flex w-full max-w-lg items-center bg-white border border-gray-300 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500 overflow-hidden transition-all">
              <div className="pl-4 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                name="q"
                defaultValue={q}
                placeholder="Szukaj w aukcjach..." 
                className="w-full py-3 px-4 outline-none text-gray-700 bg-transparent"
              />
              <button type="submit" className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors">
                Szukaj
              </button>
            </form>
          </div>

          <div className="hidden md:block">
            <Link href="/dashboard/aukcje/nowa" className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-red-200 rounded-3xl hover:border-red-400 hover:bg-red-50 transition-colors text-center shadow-sm">
              <Gavel className="w-12 h-12 text-red-400 mb-4" />
              <span className="text-lg font-bold text-gray-900">Sprzedaj swój model</span>
              <span className="text-sm text-gray-500 mt-1">Wystaw aukcję za darmo</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 w-full flex-1">
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <p className="text-gray-500 font-medium">Trwające aukcje: {auctions.length}</p>
        </div>

        {auctions.length === 0 ? (
           <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gavel className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Brak trwających aukcji</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">W tym momencie nikt nie wystawił żadnych modeli. Bądź pierwszy!</p>
              <Link href="/dashboard/aukcje/nowa" className="inline-block bg-black text-white px-6 py-3 font-medium rounded-xl hover:bg-gray-800 transition-colors">
                Wystaw pierwszą aukcję
              </Link>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {auctions.map((a) => (
              <AuctionCard key={a.id} auction={{...a, startingPrice: Number(a.startingPrice), currentPrice: Number(a.currentPrice)}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}