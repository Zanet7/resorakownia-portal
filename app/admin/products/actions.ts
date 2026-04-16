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
  const brand = formData.get("brand") as string;
  const scale = formData.get("scale") as string;
  const priceString = formData.get("price") as string;
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

  await prisma.product.create({
    data: {
      name,
      brand,
      scale,
      price,
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
  const brand = formData.get("brand") as string;
  const scale = formData.get("scale") as string;
  const priceString = formData.get("price") as string;
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

  await prisma.product.update({
    where: { id },
    data: {
      name,
      brand,
      scale,
      price,
      description,
      imageUrl,
    },
  });

  redirect("/admin/products");
}
