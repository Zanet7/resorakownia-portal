import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function middleware() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    await prisma.user.upsert({
      where: { id: data.user.id },
      update: {},
      create: {
        id: data.user.id,
        email: data.user.email!,
        role: "USER",
      },
    });
  }

  return NextResponse.next();
}
