"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAttribute(formData: FormData) {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return { error: "Brak dostępu." };
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: data.user.id }
  });

  if (!currentUser || currentUser.role !== "ADMIN") {
    return { error: "Brak dostępu: brak roli administratora." };
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as string; // 'category' | 'brand'

  if (!name || name.trim() === "") {
    return { error: "Nazwa jest wymagana." };
  }

  try {
    if (type === "category") {
      await prisma.category.create({ data: { name: name.trim() } });
    } else if (type === "brand") {
      await prisma.brand.create({ data: { name: name.trim() } });
    }
    
    revalidatePath("/admin/attributes");
    revalidatePath("/admin/products/new");
    revalidatePath("/sklep");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') return { error: "Nazwa już figuruje w słowniku!" };
    return { error: "Wystąpił błąd podczas dodawania do słownika." };
  }
}

export async function deleteAttribute(formData: FormData) {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return { error: "Brak dostępu." };

  const id = formData.get("id") as string;
  const type = formData.get("type") as string;
  
  if (!id || !type) return { error: "Błąd formatu." };

  try {
    if (type === "category") {
       const category = await prisma.category.findUnique({ where: { id }, include: { products: true }});
       if (category?.products.length) return { error: "Kategoria posiada przypisane produkty!" };
       await prisma.category.delete({ where: { id } });
    } else {
       const brand = await prisma.brand.findUnique({ where: { id }, include: { products: true }});
       if (brand?.products.length) return { error: "Marka posiada przypisane produkty!" };
       await prisma.brand.delete({ where: { id } });
    }

    revalidatePath("/admin/attributes");
    revalidatePath("/admin/products/new");
    revalidatePath("/sklep");
    return { success: true };
  } catch (error) {
    return { error: "Niespodziewany błąd przy usuwaniu." };
  }
}
