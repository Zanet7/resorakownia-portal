"use server";

import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createAuction(formData: FormData) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Musisz być zalogowany, aby dodać aukcję.");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!currentUser) {
    throw new Error("Brak dostępu.");
  }

  const title = formData.get("title") as string;
  const name = formData.get("name") as string; // nazwa modelu (produktu)
  const brandId = formData.get("brandId") as string;
  const categoryId = formData.get("categoryId") as string;
  const scale = formData.get("scale") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;

  const startingPrice = parseFloat(formData.get("startingPrice") as string);
  const durationDays = parseInt(formData.get("durationDays") as string, 10);

  if (!title || !name || isNaN(startingPrice) || isNaN(durationDays)) {
    return { error: "Wypełnij wszystkie wymagane pola." };
  }

  if (startingPrice < 0) {
    return { error: "Cena wyjściowa nie może być ujemna." };
  }

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + durationDays);

  await prisma.$transaction(async (tx) => {
    // 1. Tworzymy produkt przypisany do usera (jako wystawiającego)
    const product = await tx.product.create({
      data: {
        name,
        brandId: brandId ? brandId : null,
        categoryId: categoryId ? categoryId : null,
        scale,
        price: startingPrice, // Cena sklepowa w razie czego będzie równa wyjściowej
        stock: 1, // Jedna sztuka wędruje na aukcję
        description,
        imageUrl,
        ownerId: currentUser.id,
      },
    });

    // 2. Tworzymy aukcję przypisaną do tego produktu
    await tx.auction.create({
      data: {
        title,
        description,
        startingPrice,
        currentPrice: startingPrice,
        endDate,
        productId: product.id,
        ownerId: currentUser.id,
      },
    });
  });

  redirect("/dashboard");
}

export async function placeBid(auctionId: string, amount: number) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "unauthorized" };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const auction = await tx.auction.findUnique({
        where: { id: auctionId },
      });

      if (!auction) {
        throw new Error("Aukcja nie istnieje.");
      }

      if (auction.status !== "ACTIVE" || new Date(auction.endDate) < new Date()) {
        throw new Error("Aukcja jest już zakończona.");
      }

      if (auction.ownerId === user.id) {
        throw new Error("Nie możesz licytować własnej aukcji.");
      }

      if (amount <= Number(auction.currentPrice)) {
        throw new Error(`Kwota musi być większa niż aktualna cena (${Number(auction.currentPrice).toFixed(2)} PLN).`);
      }

      // Aktualizujemy aktualną cenę aukcji
      await tx.auction.update({
        where: { id: auctionId },
        data: { currentPrice: amount },
      });

      // Zapisujemy nową ofertę
      await tx.bid.create({
        data: {
          amount,
          userId: user.id,
          auctionId,
        },
      });

      return { success: true };
    });

    revalidatePath(`/aukcje/${auctionId}`);
    return result;
  } catch (error: any) {
    return { error: error.message || "Wystąpił nieoczekiwany błąd." };
  }
}

// Funkcja Lazy Evaluation do sprawdzania i zamykania danej aukcji
export async function checkAndCloseAuction(auctionId: string) {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: { bids: { orderBy: { amount: "desc" }, take: 1 } }
  });

  if (!auction || auction.status !== "ACTIVE") return null;

  if (new Date(auction.endDate) < new Date()) {
    const highestBid = auction.bids[0];
    const winnerId = highestBid ? highestBid.userId : null;

    const updatedAuction = await prisma.auction.update({
      where: { id: auctionId },
      data: {
        status: "COMPLETED",
        winnerId,
      }
    });

    return updatedAuction;
  }

  return auction;
}

export async function cancelAuction(auctionId: string) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("unauthorized");
  }

  const auction = await prisma.auction.findUnique({
    where: { id: auctionId }
  });

  if (!auction) {
    throw new Error("Aukcja nie istnieje.");
  }

  if (auction.ownerId !== user.id) {
    // Sprawdzamy czy to admin
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (dbUser?.role !== "ADMIN") {
      throw new Error("Nie masz uprawnień do usunięcia tej aukcji.");
    }
  }

  if (auction.status !== "ACTIVE") {
    throw new Error("Tylko aktywne aukcje mogą zostać anulowane.");
  }

  await prisma.auction.update({
    where: { id: auctionId },
    data: { status: "CANCELLED" }
  });

  revalidatePath("/dashboard");
  revalidatePath("/aukcje");
  revalidatePath(`/aukcje/${auctionId}`);
  
  return { success: true };
}
