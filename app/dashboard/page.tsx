import { Construction, History, Heart, User, ArrowRight, Gavel, Package, Mail } from "lucide-react";
import Link from "next/link";
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-4 border-white shadow-sm shrink-0">
               <User className="w-8 h-8" />
             </div>
             <div>
               <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Cześć, {username}!</h1>
               <p className="text-gray-500 mt-1">Twój panel zarządzania kolekcją i aukcjami.</p>
             </div>
          </div>
          <div className="hidden sm:block">
            <Link href="/dashboard/aukcje/nowa" className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-red-700 transition-colors">
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
                      <div className="text-gray-500 mb-1 flex items-center gap-1.5"><User className="w-4 h-4"/> Sprzedający: {auction.owner.username || "Anonim"}</div>
                      <div className="text-gray-800 font-medium flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400"/> {auction.owner.email}</div>
                      <p className="text-xs text-gray-400 mt-2">Skontaktuj się ze sprzedawcą w celu ustalenia dostawy.</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Moje Aukcje */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Gavel className="w-6 h-6 text-red-500" /> Moje wystawione aukcje
              </h2>
              <Link href="/dashboard/aukcje/nowa" className="sm:hidden text-red-600 font-medium text-sm flex items-center gap-1">Dodaj <ArrowRight className="w-4 h-4"/></Link>
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
                             <span className="text-gray-400 italic">-</span>
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
