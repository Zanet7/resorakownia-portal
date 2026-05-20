import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GarageClient from "../../components/GarageClient";

export const metadata = {
  title: "Twój Garaż | Resorakownia",
};

export default async function KolekcjonerstwoPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Pobieramy dane równolegle (wykluczamy zakończone aukcje, tj. status COMPLETED)
  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where: { 
        ownerId: user.id,
        OR: [
          { auction: null },
          { auction: { status: { in: ["ACTIVE", "CANCELLED"] } } }
        ]
      },
      include: {
        brand: true,
        category: true,
        auction: true
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }),
    prisma.brand.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] })
  ]);

  // Serializujemy Decimal i Date przed przekazaniem do Client Component
  const serializedProducts = products.map(p => {
    const isCancelled = p.auction?.status === "CANCELLED";
    return {
      ...p,
      price: Number(p.price),
      createdAt: p.createdAt.toISOString(),
      auction: (p.auction && !isCancelled) ? {
        ...p.auction,
        startingPrice: Number(p.auction.startingPrice),
        currentPrice: Number(p.auction.currentPrice),
        endDate: p.auction.endDate.toISOString(),
        createdAt: p.auction.createdAt.toISOString()
      } : null
    };
  });

  // Statystyki
  const totalCount = serializedProducts.length;
  const uniqueBrands = new Set(serializedProducts.map(p => p.brandId).filter(Boolean)).size;
  const estimatedValue = serializedProducts.reduce((acc, p) => {
    // Jeżeli produkt jest na aukcji, to bierzemy aktualną cenę licytacji, w przeciwnym razie wpisaną cenę szacunkową
    const val = p.auction ? Number(p.auction.currentPrice) : Number(p.price);
    return acc + val;
  }, 0);

  const stats = {
    totalCount,
    uniqueBrands,
    estimatedValue
  };

  return (
    <GarageClient 
      initialProducts={serializedProducts as any} 
      categories={categories} 
      brands={brands} 
      stats={stats} 
    />
  );
}
