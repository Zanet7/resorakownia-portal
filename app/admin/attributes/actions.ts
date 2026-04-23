"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAttribute(formData: FormData) {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return;
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: data.user.id }
  });

  if (!currentUser || currentUser.role !== "ADMIN") {
    return;
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as string; // 'category' | 'brand'

  if (!name || name.trim() === "") {
    return;
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
    revalidatePath("/admin/attributes");
    revalidatePath("/admin/products/new");
    revalidatePath("/sklep");
  } catch (error: any) {
    console.error("Action error:", error);
  }
}

export async function deleteAttribute(formData: FormData) {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return;

  const id = formData.get("id") as string;
  const type = formData.get("type") as string;
  
  if (!id || !type) return;

  try {
    if (type === "category") {
       const category = await prisma.category.findUnique({ where: { id }, include: { products: true }});
       if (category?.products.length) return; // Prevent deletion
       await prisma.category.delete({ where: { id } });
    } else {
       const brand = await prisma.brand.findUnique({ where: { id }, include: { products: true }});
       if (brand?.products.length) return; // Prevent deletion
       await prisma.brand.delete({ where: { id } });
    }

    revalidatePath("/admin/attributes");
    revalidatePath("/admin/products/new");
    revalidatePath("/sklep");
  } catch (error) {
    console.error("Delete action error:", error);
  }
}
