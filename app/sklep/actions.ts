"use server";

import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCart() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { items: [], error: "not_logged_in" };
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { addedAt: "desc" }
  });

  return { items };
}

export async function addToCart(productId: string) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "unauthorized" };
  }

  const existing = await prisma.cartItem.findFirst({
    where: { userId: user.id, productId }
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + 1 }
    });
  } else {
    await prisma.cartItem.create({
      data: {
        userId: user.id,
        productId,
        quantity: 1
      }
    });
  }

  revalidatePath('/sklep');
  return { success: true };
}

export async function decreaseCartQuantity(itemId: string) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "unauthorized" };

  const existing = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!existing || existing.userId !== user.id) return { error: "not_found" };

  if (existing.quantity > 1) {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: existing.quantity - 1 }
    });
  } else {
    await prisma.cartItem.delete({ where: { id: itemId } });
  }

  revalidatePath('/sklep');
  return { success: true };
}

export async function removeCartItem(itemId: string) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "unauthorized" };

  await prisma.cartItem.deleteMany({
    where: { id: itemId, userId: user.id }
  });

  revalidatePath('/sklep');
  return { success: true };
}

export async function checkoutCart() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "unauthorized" };

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true }
  });

  if (cartItems.length === 0) return { error: "empty_cart" };

  const total = cartItems.reduce((acc, item) => {
    return acc + (Number(item.product.price) * item.quantity);
  }, 0);

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: user.id,
          totalPrice: total,
          status: "PAID", // Simulation logic
        }
      });

      await Promise.all(cartItems.map(item => 
        tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }
        })
      ));

      await tx.cartItem.deleteMany({
        where: { userId: user.id }
      });
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "transaction_failed" };
  }
}

// ULUBIONE
export async function toggleFavorite(productId: string) {
   const supabase = supabaseServer();
   const { data: { user } } = await supabase.auth.getUser();
 
   if (!user) return { error: "unauthorized" };

   let favColl = await prisma.collection.findFirst({
      where: { userId: user.id, name: "Ulubione" }
   });

   if (!favColl) {
      favColl = await prisma.collection.create({
        data: {
          name: "Ulubione",
          userId: user.id
        }
      });
   }

   const existing = await prisma.collectionItem.findFirst({
      where: { collectionId: favColl.id, productId }
   });

   if (existing) {
      await prisma.collectionItem.delete({ where: { id: existing.id } });
      revalidatePath(`/sklep`);
      return { status: "removed" };
   } else {
      await prisma.collectionItem.create({
        data: {
          collectionId: favColl.id,
          productId
        }
      });
      revalidatePath(`/sklep`);
      return { status: "added" };
   }
}

export async function getIsFavorite(productId: string) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const favColl = await prisma.collection.findFirst({
    where: { userId: user.id, name: "Ulubione" }
  });

  if (!favColl) return false;

  const existing = await prisma.collectionItem.findFirst({
    where: { collectionId: favColl.id, productId }
  });

  return !!existing;
}
