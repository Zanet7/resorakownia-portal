"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getUserRole() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return null;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: data.user.id },
  });

  return dbUser?.role || "USER";
}
