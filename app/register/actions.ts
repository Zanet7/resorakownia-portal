"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function registerAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

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

  // Set default placeholder avatar based on username or email
  const displayUsername = username?.trim() || email.split('@')[0];
  
  if (data.user) {
    try {
      // 2. Po pomyślnej rejestracji, tworzymy zapis użytkownika w Prisma z rolą USER
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: {
          role: "USER",
          // jeśli już istnieje, nie nadpisujemy username, żeby mu go nie zepsuć
        },
        create: {
          id: data.user.id,
          email: data.user.email!,
          role: "USER",
          username: displayUsername,
        },
      });
    } catch (dbError: any) {
      // W razie błędu o unikalność (username zajęte z innego konta) dodaj losowy suffix
      const randomSuffix = Math.floor(Math.random() * 10000);
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: { role: "USER" },
        create: {
          id: data.user.id,
          email: data.user.email!,
          role: "USER",
          username: `${displayUsername}${randomSuffix}`,
        },
      });
    }
  }

  // 3. Zwracamy informację o sukcesie (przekierowanie w kliencie)
  return { success: true };
}
