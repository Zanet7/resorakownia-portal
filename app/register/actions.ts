"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function registerAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email i hasło są wymagane" };
  }

  const supabase = supabaseServer();
  
  // 1. Rejestracja w Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    // 2. Po pomyślnej rejestracji, tworzymy zapis użytkownika w Prisma z rolą ADMIN
    // w klauzuli upsert, na wypadek gdyby ktoś odświeżył
    await prisma.user.upsert({
      where: { id: data.user.id },
      update: {
        role: "ADMIN",
      },
      create: {
        id: data.user.id,
        email: data.user.email!,
        role: "ADMIN",
      },
    });
  }

  // 3. Przekierowujemy na login
  redirect("/login");
}
