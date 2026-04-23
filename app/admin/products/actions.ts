"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("Brak dostępu: niezalogowany.");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: data.user.id },
  });

  if (!currentUser || currentUser.role !== "ADMIN") {
    throw new Error("Brak dostępu: brak roli administratora.");
  }

  const name = formData.get("name") as string;
  const brandId = formData.get("brandId") as string;
  const categoryId = formData.get("categoryId") as string;
  const scale = formData.get("scale") as string;
  const priceString = formData.get("price") as string;
  const stockString = formData.get("stock") as string;
  const description = formData.get("description") as string;
  let imageUrl = formData.get("imageUrl") as string;

  // Jeżeli imageUrl jest puste, damy darmowy placeholder
  if (!imageUrl || imageUrl.trim() === "") {
    imageUrl = "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800";
  }

  if (!name || !priceString) {
    return { error: "Nazwa modelu oraz cena są wymagane!" };
  }

  const price = parseFloat(priceString.replace(",", "."));
  if (isNaN(price)) {
    return { error: "Cena musi być poprawną liczbą." };
  }

  const stock = parseInt(stockString || "0", 10);
  if (isNaN(stock) || stock < 0) {
    return { error: "Ilość w magazynie musi być prawidłową, nieujemną liczbą." };
  }

  await prisma.product.create({
    data: {
      name,
      brandId: brandId ? brandId : null,
      categoryId: categoryId ? categoryId : null,
      scale,
      price,
      stock,
      description,
      imageUrl,
      ownerId: data.user.id,
    },
  });

  // Przekierowujemy do sklepu po dodaniu
  redirect("/sklep");
}

export async function updateProduct(formData: FormData) {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("Brak dostępu: niezalogowany.");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: data.user.id },
  });

  if (!currentUser || currentUser.role !== "ADMIN") {
    throw new Error("Brak dostępu: brak roli administratora.");
  }

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const brandId = formData.get("brandId") as string;
  const categoryId = formData.get("categoryId") as string;
  const scale = formData.get("scale") as string;
  const priceString = formData.get("price") as string;
  const stockString = formData.get("stock") as string;
  const description = formData.get("description") as string;
  let imageUrl = formData.get("imageUrl") as string;

  if (!id) {
    return { error: "Brak ID produktu do edycji." };
  }

  if (!imageUrl || imageUrl.trim() === "") {
    imageUrl = "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800";
  }

  if (!name || !priceString) {
    return { error: "Nazwa modelu oraz cena są wymagane!" };
  }

  const price = parseFloat(priceString.replace(",", "."));
  if (isNaN(price)) {
    return { error: "Cena musi być poprawną liczbą." };
  }

  const stock = parseInt(stockString || "0", 10);
  if (isNaN(stock) || stock < 0) {
    return { error: "Ilość w magazynie musi być prawidłową, nieujemną liczbą." };
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      brandId: brandId ? brandId : null,
      categoryId: categoryId ? categoryId : null,
      scale,
      price,
      stock,
      description,
      imageUrl,
    },
  });

  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("Brak dostępu: niezalogowany.");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: data.user.id },
  });

  if (!currentUser || currentUser.role !== "ADMIN") {
    throw new Error("Brak dostępu: brak roli administratora.");
  }

  const id = formData.get("id") as string;
  
  if (!id) {
    throw new Error("Brak ID produktu do usunięcia.");
  }

  // Usunięcie powiązanych danych, m.in. z koszyka lub ulubionych, zanim usuniemy produkt
  await prisma.cartItem.deleteMany({ where: { productId: id } });
  await prisma.collectionItem.deleteMany({ where: { productId: id } });
  await prisma.orderItem.deleteMany({ where: { productId: id } });

  await prisma.product.delete({
    where: { id },
  });

  redirect("/admin/products");
}
