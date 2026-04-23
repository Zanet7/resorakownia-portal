import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Car, Tag, User as UserIcon, Calendar, Info, Clock, AlertCircle } from "lucide-react";
import BidForm from "@/components/BidForm";
import Countdown from "@/components/Countdown";
import { supabaseServer } from "@/lib/supabase/server";
import { checkAndCloseAuction } from "@/app/aukcje/actions";

export default async function AuctionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  // Lazy Evaluation: Sprawdzamy, czy aukcja nie powinna zostać zamknięta
  await checkAndCloseAuction(resolvedParams.id);

  const auction = await prisma.auction.findUnique({
    where: { id: resolvedParams.id },
    include: {
      product: {
        include: { brand: true, category: true }
      },
      owner: true,
      bids: {
        orderBy: { amount: "desc" },
        take: 5,
        include: { user: true }
      }
    }
  });

  if (!auction) {
    notFound();
  }

  const isEnded = auction.status !== "ACTIVE" || new Date(auction.endDate) < new Date();
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const isOwner = user?.id === auction.ownerId;
  const highestBid = auction.bids.length > 0 ? auction.bids[0] : null;
  const isWinner = isEnded && highestBid && user?.id === highestBid.userId;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header (Top Nav) */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/aukcje" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Wróć do aukcji</span>
          </Link>
          <div className="text-sm font-semibold text-gray-900 hidden sm:block">
            {auction.title}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 mt-4">

        {isEnded && auction.status !== "CANCELLED" && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Ta aukcja została zakończona</h3>
                <p className="text-gray-600 mt-1">Licytacja tego modelu dobiegła końca. {highestBid ? `Zwycięska oferta to ${Number(highestBid.amount).toFixed(2)} PLN.` : "Nikt nie zalicytował tego modelu."}</p>
              </div>
            </div>
            {(isWinner || isOwner) && (
              <Link href="/dashboard" className="shrink-0 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-sm">
                Przejdź do panelu
              </Link>
            )}
          </div>
        )}

        {auction.status === "CANCELLED" && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Aukcja anulowana</h3>
                  <p className="text-gray-600 mt-1">Sprzedawca zdecydował się usunąć/anulować tę aukcję przed jej zakończeniem.</p>
                </div>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Lewa: Zdjęcie i info o produkcie */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm aspect-square flex items-center justify-center p-8 relative">
              {auction.product.imageUrl ? (
                <img
                  src={auction.product.imageUrl}
                  alt={auction.product.name}
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                />
              ) : (
                <Car className="w-32 h-32 text-gray-200" />
              )}
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Parametry modelu</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <dt className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2"><Car className="w-4 h-4" /> Nazwa bazowa</dt>
                  <dd className="text-base font-semibold text-gray-900">{auction.product.name}</dd>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <dt className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2"><Tag className="w-4 h-4" /> Marka</dt>
                  <dd className="text-base font-semibold text-gray-900">{auction.product.brand?.name || "Brak danych"}</dd>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <dt className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2"><Info className="w-4 h-4" /> Kategoria</dt>
                  <dd className="text-base font-semibold text-gray-900">{auction.product.category?.name || "Brak danych"}</dd>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <dt className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" /> Skala / Rok</dt>
                  <dd className="text-base font-semibold text-gray-900">{auction.product.scale || "Nieznana"} {auction.product.year ? `/ ${auction.product.year}` : ""}</dd>
                </div>
              </dl>

              {auction.product.description && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Opis od sprzedającego</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{auction.product.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Prawa: Aukcja i Licytacja */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">{auction.title}</h1>
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <UserIcon className="w-4 h-4" /> Sprzedający: {auction.owner?.username || "Anonim"}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Aktualna cena</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900">{Number(auction.currentPrice).toFixed(2)}</span>
                    <span className="text-xl font-bold text-gray-500">PLN</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Cena wyjściowa: {Number(auction.startingPrice).toFixed(2)} PLN</p>
                </div>
                <div className="h-px w-full sm:h-16 sm:w-px bg-gray-200 hidden sm:block"></div>
                <div className="flex flex-col sm:items-end">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Do końca</p>
                  <Countdown endDate={auction.endDate.toISOString()} />
                </div>
              </div>

              {!isOwner && <BidForm auctionId={auction.id} currentPrice={Number(auction.currentPrice)} isEnded={isEnded} />}

              {isOwner && !isEnded && (
                <div className="bg-blue-50 text-blue-700 border border-blue-100 rounded-2xl p-6 text-center font-medium">
                  Jesteś właścicielem tej aukcji. Śledź na bieżąco oferty licytujących.
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Historia ofert</h3>
              {auction.bids.length === 0 ? (
                <p className="text-gray-500 text-center py-6">Brak ofert. Bądź pierwszy!</p>
              ) : (
                <ul className="space-y-4">
                  {auction.bids.map((bid, index) => (
                    <li key={bid.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-600'}`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{bid.user?.username || bid.userId.substring(0, 8)}</p>
                          <p className="text-xs text-gray-400">{new Date(bid.createdAt).toLocaleString("pl-PL")}</p>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {Number(bid.amount).toFixed(2)} PLN
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
