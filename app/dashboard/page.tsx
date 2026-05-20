import { Construction, History, Heart, User, ArrowRight, Gavel, Package, Mail, Trash2, TrendingUp, ShoppingBag } from "lucide-react";
import Link from "next/link";
import CancelAuctionButton from "@/components/dashboard/CancelAuctionButton";
import CancelledBidsAlert from "@/components/dashboard/CancelledBidsAlert";
import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "Twój Panel | Resorakownia",
};

export default async function DashboardPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [dbUser, myAuctions, wonAuctions, biddingAuctions, favoriteItems, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { username: true, role: true }
    }),
    prisma.auction.findMany({
      where: { ownerId: user.id },
      include: { product: true, winner: true, bids: { orderBy: { amount: "desc" }, take: 1 } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.auction.findMany({
      where: { winnerId: user.id },
      include: { product: true, owner: true },
      orderBy: { endDate: "desc" }
    }),
    prisma.auction.findMany({
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
    }),
    prisma.collectionItem.findMany({
      where: {
        collection: {
          userId: user.id,
          name: "Ulubione"
        }
      },
      include: {
        product: {
          include: {
            brand: true,
            category: true
          }
        }
      },
      orderBy: {
        addedAt: "desc"
      }
    }),
    prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                brand: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  ]);

  if (dbUser?.role === "ADMIN") {
    redirect("/admin");
  }

  const username = dbUser?.username || "Kolekcjonerze";

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

        {/* Ulubione Produkty */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" /> Ulubione produkty
            </h2>
            <span className="text-xs font-semibold bg-red-50 text-red-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {favoriteItems.length} {favoriteItems.length === 1 ? 'model' : favoriteItems.length > 1 && favoriteItems.length < 5 ? 'modele' : 'modeli'}
            </span>
          </div>

          {favoriteItems.length === 0 ? (
            <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium mb-1">Brak ulubionych produktów</p>
              <p className="text-gray-400 text-sm mb-4">Dodaj produkty w sklepie za pomocą ikony serduszka, aby pojawiły się w tym miejscu.</p>
              <Link
                href="/sklep"
                className="inline-flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Przejdź do sklepu
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {favoriteItems.map((item) => (
                <ProductCard
                  key={item.product.id}
                  p={{
                    ...item.product,
                    price: Number(item.product.price)
                  }}
                  isFavInitial={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Historia Zakupów */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-orange-500" /> Historia zakupów
            </h2>
            <span className="text-xs font-semibold bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {orders.length} {orders.length === 1 ? 'zamówienie' : orders.length > 1 && orders.length < 5 ? 'zamówienia' : 'zamówień'}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium mb-1">Brak historii zakupów</p>
              <p className="text-gray-400 text-sm mb-4">Nie dokonałeś jeszcze żadnych zakupów w naszym portalu.</p>
              <Link
                href="/sklep"
                className="inline-flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Przejdź do sklepu
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50 mb-4">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-gray-400 uppercase">Zamówienie</div>
                      <div className="text-sm font-mono font-bold text-gray-800 break-all">{order.id}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="text-right sm:text-left">
                        <div className="text-xs font-semibold text-gray-400 uppercase">Data</div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString("pl-PL", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase mb-0.5">Status</div>
                        {order.status === "PENDING" ? (
                          <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs px-2.5 py-1 rounded-md font-bold inline-block">OCZEKUJĄCE</span>
                        ) : order.status === "PAID" ? (
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-1 rounded-md font-bold inline-block">OPŁACONE</span>
                        ) : order.status === "SHIPPED" ? (
                          <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs px-2.5 py-1 rounded-md font-bold inline-block">WYSŁANE</span>
                        ) : order.status === "COMPLETED" ? (
                          <span className="bg-green-50 text-green-700 border border-green-200 text-xs px-2.5 py-1 rounded-md font-bold inline-block">ZREALIZOWANE</span>
                        ) : (
                          <span className="bg-red-50 text-red-700 border border-red-200 text-xs px-2.5 py-1 rounded-md font-bold inline-block">ANULOWANE</span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase">Razem</div>
                        <div className="text-sm font-black text-gray-900">{Number(order.totalPrice).toFixed(2)} PLN</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Zakupione modele:</div>
                    <div className="divide-y divide-gray-50">
                      {order.items.map((item) => (
                        <div key={item.id} className="py-2.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            {item.product.imageUrl && (
                              <div className="w-12 h-12 rounded-lg bg-gray-50 p-1 flex items-center justify-center border border-gray-100 shrink-0">
                                <img
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  className="max-w-full max-h-full object-contain"
                                  loading="lazy"
                                />
                              </div>
                            )}
                            <div>
                              <Link
                                href={`/sklep/${item.product.id}`}
                                className="font-bold text-gray-900 hover:text-orange-600 transition-colors text-sm line-clamp-1"
                              >
                                {item.product.name}
                              </Link>
                              <div className="text-xs text-gray-500 font-semibold uppercase">
                                {item.product.brand?.name || "ZBIORCZY"}
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-bold text-gray-900">
                              {item.quantity} szt. &times; {Number(item.price).toFixed(2)} PLN
                            </div>
                            <div className="text-xs text-gray-500">
                              Suma: {(Number(item.price) * item.quantity).toFixed(2)} PLN
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
