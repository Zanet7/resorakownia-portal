export const dynamic = "force-dynamic";
import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return <div className="p-10">Brak dostępu</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: data.user.id },
  });

  if (user?.role !== "ADMIN") {
    return <div className="p-10">Brak uprawnień</div>;
  }

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-3xl font-bold">Panel administratora</h1>

      <div className="space-x-4">
        <a
          href="/admin/products"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Produkty
        </a>

        <a
          href="/admin/users"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Użytkownicy
        </a>
      </div>
    </div>
  );
}
