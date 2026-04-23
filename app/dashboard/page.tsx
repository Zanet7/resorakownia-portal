import { Construction, History, Heart, User, ArrowRight, Gavel, Package, Mail, Trash2, TrendingUp } from "lucide-react";
import Link from "next/link";
import CancelAuctionButton from "@/components/dashboard/CancelAuctionButton";
import CancelledBidsAlert from "@/components/dashboard/CancelledBidsAlert";
import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Twój Panel | Resorakownia",
};

export default async function DashboardPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { username: true, role: true }
  });

  if (dbUser?.role === "ADMIN") {
    redirect("/admin");
  }

  const username = dbUser?.username || "Kolekcjonerze";

  // Pobierz moje wystawione aukcje
  const myAuctions = await prisma.auction.findMany({
    where: { ownerId: user.id },
    include: { product: true, winner: true, bids: { orderBy: { amount: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" }
  });

  // Pobierz wygrane aukcje
  const wonAuctions = await prisma.auction.findMany({
    where: { winnerId: user.id },
    include: { product: true, owner: true },
    orderBy: { endDate: "desc" }
  });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Pobierz licytowane aukcje (aktywne + zakończone w ciągu ostatnich 7 dni, w których nie wygraliśmy)
  const biddingAuctions = await prisma.auction.findMany({
    where: { 
      bids: { some: { userId: user.id } },
      OR: [
        { status: "ACTIVE" },
        { status: "COMPLETED", winnerId: { not: user.id }, endDate: { gte: sevenDaysAgo } },
        { status: "CANCELLED", endDate: { gte: sevenDaysAgo } }
      ]
    },
    include: { bids: { orderBy: { amount: "desc" }, take: 1 } },
    orderBy: { endDate: "desc" }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-4 border-white shadow-sm shrink-0">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Cześć, {username}!</h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">Twój panel zarządzania kolekcją i aukcjami.</p>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <Link href="/dashboard/aukcje/nowa" className="flex items-center justify-center w-full sm:w-auto gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-red-700 transition-colors">
              <Gavel className="w-5 h-5" />
              Wystaw aukcję
            </Link>
          </div>
        </div>

        {/* Wygrane Aukcje */}
        {wonAuctions.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-green-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-green-500" /> Wygrane aukcje
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wonAuctions.map(auction => (
                <div key={auction.id} className="bg-green-50 border border-green-200 rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="font-bold text-gray-900 mb-1 line-clamp-1">{auction.title}</div>
                  <div className="text-sm text-green-700 font-semibold mb-4">Wygrana: {Number(auction.currentPrice).toFixed(2)} PLN</div>

                  <div className="bg-white rounded-xl p-3 border border-green-100 text-sm">
                    <div className="text-gray-500 mb-1 flex items-center gap-1.5"><User className="w-4 h-4" /> Sprzedający: {auction.owner.username || "Anonim"}</div>
                    <div className="text-gray-800 font-medium flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400" /> {auction.owner.email}</div>
                    <p className="text-xs text-gray-400 mt-2">Skontaktuj się ze sprzedawcą w celu ustalenia dostawy.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Licytowane Aukcje */}
        {biddingAuctions.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-500" /> Licytowane przez Ciebie
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {biddingAuctions.map(auction => {
                const highestBid = auction.bids[0];
                const amIHighest = highestBid?.userId === user.id;
                
                const isCompleted = auction.status === "COMPLETED";
                const isCancelled = auction.status === "CANCELLED";
                const isExpired = auction.status === "ACTIVE" && new Date(auction.endDate) < new Date();
                
                const isEnded = isCompleted || isCancelled || isExpired;
                
                let message = amIHighest ? 'Wygrywasz!' : 'Ktoś Cię przebił!';
                if (isCompleted || isExpired) message = 'Aukcja zakończona';
                if (isCancelled) message = 'Aukcja anulowana';
                
                return (
                  <Link href={`/aukcje/${auction.id}`} key={auction.id} className={`border rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-all block hover:-translate-y-1 ${isEnded ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="font-bold text-gray-900 mb-1 line-clamp-1">{auction.title}</div>
                    <div className={`text-sm font-semibold mb-4 ${isEnded ? 'text-gray-700' : 'text-blue-700'}`}>
                      {isEnded ? 'Cena końcowa:' : 'Aktualna cena:'} {Number(auction.currentPrice).toFixed(2)} PLN
                    </div>
                    
                    <div className={`rounded-xl p-3 border text-sm font-medium text-center ${
                      isEnded 
                        ? 'bg-gray-100 border-gray-200 text-gray-600' 
                        : (amIHighest ? 'bg-green-100 border-green-200 text-green-800' : 'bg-red-100 border-red-200 text-red-800')
                    }`}>
                       {message}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Moje Aukcje */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Gavel className="w-6 h-6 text-red-500" /> Moje wystawione aukcje
            </h2>
          </div>

          {myAuctions.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500">Nie wystawiłeś jeszcze żadnych modeli na licytację.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-xl">Aukcja</th>
                    <th className="px-4 py-3">Aktualna cena</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-tr-xl">Zwycięzca</th>
                  </tr>
                </thead>
                <tbody>
                  {myAuctions.map(auction => (
                    <tr key={auction.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <Link href={`/aukcje/${auction.id}`} className="font-semibold text-gray-900 hover:text-red-600 transition-colors">
                          {auction.title}
                        </Link>
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-900">
                        {Number(auction.currentPrice).toFixed(2)} PLN
                      </td>
                      <td className="px-4 py-4">
                        {auction.status === "ACTIVE" ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">AKTYWNA</span>
                        ) : auction.status === "COMPLETED" ? (
                          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs font-bold">ZAKOŃCZONA</span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold">ANULOWANA</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {auction.status === "COMPLETED" && auction.winner ? (
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{auction.winner.username || "Użytkownik"}</div>
                            <div className="text-gray-500 text-xs">{auction.winner.email}</div>
                          </div>
                        ) : auction.status === "COMPLETED" ? (
                          <span className="text-gray-400 italic">Brak ofert</span>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 italic">-</span>
                            {auction.status === "ACTIVE" && (
                              <CancelAuctionButton auctionId={auction.id} />
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
