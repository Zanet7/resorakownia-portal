"use server";

import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addToCollection(formData: FormData) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Musisz być zalogowany, aby dodać model do kolekcji." };
  }

  const name = formData.get("name") as string;
  const brandId = formData.get("brandId") as string;
  const categoryId = formData.get("categoryId") as string;
  const scale = formData.get("scale") as string;
  const yearStr = formData.get("year") as string;
  const description = formData.get("description") as string;
  let imageUrl = formData.get("imageUrl") as string;

  if (!name) {
    return { error: "Nazwa modelu jest wymagana." };
  }

  if (!imageUrl || imageUrl.trim() === "") {
    imageUrl = "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800";
  }

  let year: number | null = null;
  if (yearStr) {
    year = parseInt(yearStr, 10);
    if (isNaN(year)) year = null;
  }

  try {
    await prisma.product.create({
      data: {
        name,
        brandId: brandId ? brandId : null,
        categoryId: categoryId ? categoryId : null,
        scale: scale || null,
        year,
        description: description || null,
        imageUrl,
        price: 0, // Domyślna wartość szacunkowa w garażu, dopóki nie zostanie wystawiona
        stock: 1, // Pojedynczy model w kolekcji
        ownerId: user.id
      }
    });

    revalidatePath("/kolekcjonerstwo");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: "Wystąpił błąd podczas dodawania do kolekcji." };
  }
}

export async function removeFromCollection(productId: string) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Niezalogowany." };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { auction: true }
    });

    if (!product) {
      return { error: "Model nie istnieje." };
    }

    if (product.ownerId !== user.id) {
      return { error: "Brak uprawnień do tego modelu." };
    }

    if (product.auction) {
      if (product.auction.status === "CANCELLED") {
        await prisma.comment.deleteMany({ where: { auctionId: product.auction.id } });
        await prisma.bid.deleteMany({ where: { auctionId: product.auction.id } });
        await prisma.auction.delete({ where: { id: product.auction.id } });
      } else {
        return { error: "Nie można usunąć modelu, który jest obecnie na aukcji." };
      }
    }

    // Usunięcie powiązań (np. z ulubionych, koszyka)
    await prisma.collectionItem.deleteMany({ where: { productId } });
    await prisma.cartItem.deleteMany({ where: { productId } });

    await prisma.product.delete({
      where: { id: productId }
    });

    revalidatePath("/kolekcjonerstwo");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: "Nie udało się usunąć modelu z kolekcji." };
  }
}

export async function listCollectionItemOnAuction(formData: FormData) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Niezalogowany." };
  }

  const productId = formData.get("productId") as string;
  const title = formData.get("title") as string;
  const startingPriceStr = formData.get("startingPrice") as string;
  const durationDaysStr = formData.get("durationDays") as string;

  if (!productId || !title || !startingPriceStr || !durationDaysStr) {
    return { error: "Wszystkie pola są wymagane do wystawienia aukcji." };
  }

  const startingPrice = parseFloat(startingPriceStr.replace(",", "."));
  if (isNaN(startingPrice) || startingPrice < 0) {
    return { error: "Cena wyjściowa musi być poprawną liczbą dodatnią." };
  }

  const durationDays = parseInt(durationDaysStr, 10);
  if (isNaN(durationDays) || durationDays <= 0) {
    return { error: "Czas trwania musi być prawidłową liczbą dni." };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { auction: true }
    });

    if (!product) {
      return { error: "Model nie istnieje." };
    }

    if (product.ownerId !== user.id) {
      return { error: "Brak uprawnień." };
    }

    if (product.auction) {
      if (product.auction.status === "CANCELLED") {
        await prisma.comment.deleteMany({ where: { auctionId: product.auction.id } });
        await prisma.bid.deleteMany({ where: { auctionId: product.auction.id } });
        await prisma.auction.delete({ where: { id: product.auction.id } });
      } else {
        return { error: "Ten model jest już wystawiony na aukcję." };
      }
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    await prisma.$transaction(async (tx) => {
      // Aktualizujemy cenę produktu na wyjściową w celu spójności
      await tx.product.update({
        where: { id: productId },
        data: { price: startingPrice }
      });

      // Tworzymy aukcję powiązaną z tym produktem
      await tx.auction.create({
        data: {
          title,
          description: product.description || `Model ${product.name} z kolekcji użytkownika.`,
          startingPrice,
          currentPrice: startingPrice,
          endDate,
          productId,
          ownerId: user.id
        }
      });
    });

    revalidatePath("/kolekcjonerstwo");
    revalidatePath("/aukcje");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: "Błąd podczas wystawiania modelu na aukcję." };
  }
}
