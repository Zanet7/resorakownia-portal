import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;

    return Response.json({
      ok: true,
      message: "Połączenie z Supabase działa!",
      time: result,
    });
  } catch (error: any) {
    return Response.json({
      ok: false,
      message: "Błąd połączenia z Supabase",
      error: error.message,
    });
  }
}