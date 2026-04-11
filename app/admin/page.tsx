import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return <div>Brak dostępu</div>;

  const user = await prisma.user.findUnique({
    where: { id: data.user.id },
  });

  if (user?.role !== "ADMIN") {
    return <div>Brak uprawnień</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Panel administratora</h1>

      <a
        href="/admin/products/new"
        className="bg-black text-white px-4 py-2 rounded"
      >
        Dodaj produkt
      </a>
    </div>
  );
}
