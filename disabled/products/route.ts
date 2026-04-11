import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: data.user.id },
  });

  if (user?.role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const product = await prisma.product.create({
    data: {
      name: body.name,
      price: body.price,
      ownerId: user.id,
    },
  });

  return Response.json(product);
}